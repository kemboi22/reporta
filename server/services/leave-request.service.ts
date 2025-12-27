import type {
  LeaveRequest,
  Prisma,
  LeaveStatus,
} from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const CACHE_TTL = 600;
const CACHE_PREFIX = "leave:";

export type LeaveRequestCreateInput = Prisma.LeaveRequestCreateInput;
export type LeaveRequestUpdateInput = Prisma.LeaveRequestUpdateInput;
export type LeaveRequestWithRelations = Prisma.LeaveRequestGetPayload<{
  include: {
    organization: true;
    staff: true;
  };
}>;

export const getLeaveRequestById = async (
  id: string,
): Promise<LeaveRequest | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}`;
  const cached = await cacheGet<LeaveRequest>(cacheKey);
  if (cached) return cached;

  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: { id },
  });

  if (leaveRequest) {
    await cacheSet(cacheKey, leaveRequest, CACHE_TTL);
  }

  return leaveRequest;
}

export const getStaffLeaveRequests = async (
  staffId: string,
  params?: {
    skip?: number;
    take?: number;
    status?: LeaveStatus;
  },
): Promise<LeaveRequest[]> => {
  const { skip = 0, take = 20, status } = params || {};

  const where: Prisma.LeaveRequestWhereInput = { staffId };
  if (status) {
    where.status = status;
  }

  return prisma.leaveRequest.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });
}

export const getOrganizationLeaveRequests = async (
  organizationId: string,
  params?: {
    skip?: number;
    take?: number;
    status?: LeaveStatus;
  },
): Promise<LeaveRequest[]> => {
  const { skip = 0, take = 50, status } = params || {};

  const where: Prisma.LeaveRequestWhereInput = { organizationId };
  if (status) {
    where.status = status;
  }

  return prisma.leaveRequest.findMany({
    where,
    skip,
    take,
    include: {
      staff: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export const createLeaveRequest = async (
  data: LeaveRequestCreateInput,
): Promise<LeaveRequest> => {
  const leaveRequest = await prisma.leaveRequest.create({ data });

  await invalidateLeaveCache(
    leaveRequest.id,
    leaveRequest.staffId,
    leaveRequest.organizationId,
  );

  return leaveRequest;
}

export const approveLeaveRequest = async (
  id: string,
  approvedBy: string,
): Promise<LeaveRequest> => {
  const leaveRequest = await prisma.leaveRequest.update({
    where: { id },
    data: {
      status: "APPROVED",
      approvedBy,
      approvedAt: new Date(),
    },
  });

  await invalidateLeaveCache(
    id,
    leaveRequest.staffId,
    leaveRequest.organizationId,
  );

  return leaveRequest;
}

export const rejectLeaveRequest = async (
  id: string,
  rejectionReason: string,
): Promise<LeaveRequest> => {
  const leaveRequest = await prisma.leaveRequest.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectionReason,
      rejectedAt: new Date(),
    },
  });

  await invalidateLeaveCache(
    id,
    leaveRequest.staffId,
    leaveRequest.organizationId,
  );

  return leaveRequest;
}

export const updateLeaveRequest = async (
  id: string,
  data: LeaveRequestUpdateInput,
): Promise<LeaveRequest> => {
  const leaveRequest = await prisma.leaveRequest.update({
    where: { id },
    data,
  });

  await invalidateLeaveCache(
    id,
    leaveRequest.staffId,
    leaveRequest.organizationId,
  );

  return leaveRequest;
}

export const deleteLeaveRequest = async (id: string): Promise<LeaveRequest> => {
  const lv = await prisma.leaveRequest.delete({
    where: {
      id: id,
    },
  });
  return lv;
};

const invalidateLeaveCache = async (
  id: string,
  staffId: string,
  organizationId: string,
): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${id}`);
}
