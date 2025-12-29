import type { Staff, Prisma } from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const CACHE_TTL = 1800;
const CACHE_PREFIX = "staff:";

export type StaffCreateInput = Prisma.StaffCreateInput;
export type StaffUpdateInput = Prisma.StaffUpdateInput;
export type StaffWithRelations = Prisma.StaffGetPayload<{
  include: {
    organization: true;
    department: true;
    user: true;
    attendance: true;
    leaveRequests: true;
    appraisals: true;
    shifts: true;
  };
}>;

export const getStaffById = async (id: string): Promise<Staff | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}`;
  const cached = await cacheGet<Staff>(cacheKey);
  if (cached) return cached;

  const staff = await prisma.staff.findUnique({
    where: { id },
  });

  if (staff) {
    await cacheSet(cacheKey, staff, CACHE_TTL);
  }

  return staff;
}

export const getStaffByEmail = async (
  organizationId: string,
  email: string
): Promise<Staff | null> => {
  const cacheKey = `${CACHE_PREFIX}org:${organizationId}:email:${email}`;
  const cached = await cacheGet<Staff>(cacheKey);
  if (cached) return cached;

  const staff = await prisma.staff.findFirst({
    where: {
      organizationId,
      email,
    },
  });

  if (staff) {
    await cacheSet(cacheKey, staff, CACHE_TTL);
  }

  return staff;
}

export const getStaffByEmployeeId = async (
  organizationId: string,
  employeeId: string
): Promise<Staff | null> => {
  const cacheKey = `${CACHE_PREFIX}org:${organizationId}:employeeId:${employeeId}`;
  const cached = await cacheGet<Staff>(cacheKey);
  if (cached) return cached;

  const staff = await prisma.staff.findFirst({
    where: {
      organizationId,
      employeeId,
    },
  });

  if (staff) {
    await cacheSet(cacheKey, staff, CACHE_TTL);
  }

  return staff;
}

export const getStaffList = async (params?: {
  skip?: number;
  take?: number;
  where?: Prisma.StaffWhereInput;
  include?: Prisma.StaffInclude;
}): Promise<Staff[]> => {
  const { skip = 0, take = 50, where, include } = params || {};
  
  const defaultInclude: Prisma.StaffInclude = {
    user: true,
  };

  return prisma.staff.findMany({
    skip,
    take,
    where,
    include: include || defaultInclude,
  });
}

export const createStaff = async (data: StaffCreateInput): Promise<Staff> => {
  const staff = await prisma.staff.create({ data });

  const cacheKey = `${CACHE_PREFIX}${staff.id}`;
  await cacheSet(cacheKey, staff, CACHE_TTL);

  return staff;
}

export const updateStaff = async (id: string, data: StaffUpdateInput): Promise<Staff> => {
  const staff = await prisma.staff.update({
    where: { id },
    data,
  });

  await invalidateStaffCache(id);

  return staff;
}

export const deleteStaff = async (id: string): Promise<Staff> => {
  const staff = await prisma.staff.delete({
    where: { id },
  });

  await invalidateStaffCache(id);

  return staff;
}

const invalidateStaffCache = async (id: string): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${id}`);
}
