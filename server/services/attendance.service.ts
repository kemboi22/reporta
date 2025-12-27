import type { Attendance, Prisma } from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const CACHE_TTL = 300;
const CACHE_PREFIX = "attendance:";

export type AttendanceCreateInput = Prisma.AttendanceCreateInput;
export type AttendanceUpdateInput = Prisma.AttendanceUpdateInput;
export type AttendanceWithRelations = Prisma.AttendanceGetPayload<{
  include: {
    organization: true;
    staff: true;
    device: true;
  };
}>;

export const getAttendanceById = async (
  id: string,
): Promise<Attendance | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}`;
  const cached = await cacheGet<Attendance>(cacheKey);
  if (cached) return cached;

  const attendance = await prisma.attendance.findUnique({
    where: { id },
  });

  if (attendance) {
    await cacheSet(cacheKey, attendance, CACHE_TTL);
  }

  return attendance;
};

export const getAttendanceByStaff = async (
  staffId: string,
  params?: {
    startDate?: Date;
    endDate?: Date;
    skip?: number;
    take?: number;
  },
): Promise<Attendance[]> => {
  const { startDate, endDate, skip = 0, take = 50 } = params || {};

  const cacheKey = `${CACHE_PREFIX}staff:${staffId}:${startDate?.toISOString() || "all"}:${endDate?.toISOString() || "all"}`;
  const cached = await cacheGet<Attendance[]>(cacheKey);
  if (cached) return cached;

  const where: Prisma.AttendanceWhereInput = { staffId };
  if (startDate || endDate) {
    where.checkIn = {};
    if (startDate) where.checkIn.gte = startDate;
    if (endDate) where.checkIn.lte = endDate;
  }

  const attendance = await prisma.attendance.findMany({
    where,
    skip,
    take,
    orderBy: { checkIn: "desc" },
  });

  await cacheSet(cacheKey, attendance, CACHE_TTL);

  return attendance;
};

export const getTodayAttendance = async (
  organizationId: string,
): Promise<Attendance[]> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const cacheKey = `${CACHE_PREFIX}org:${organizationId}:today`;
  const cached = await cacheGet<Attendance[]>(cacheKey);
  if (cached) return cached;

  const attendance = await prisma.attendance.findMany({
    where: {
      organizationId,
      checkIn: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      staff: true,
    },
  });

  await cacheSet(cacheKey, attendance, CACHE_TTL);

  return attendance;
};

export const checkIn = async (
  data: Omit<AttendanceCreateInput, "checkIn">,
): Promise<Attendance> => {
  const attendance = await prisma.attendance.create({
    data: {
      ...data,
      checkIn: new Date(),
    },
  });

  await invalidateAttendanceCache(
    attendance.id,
    attendance.staffId,
    attendance.organizationId,
  );

  return attendance;
};

export const checkOut = async (
  id: string,
  notes?: string,
): Promise<Attendance> => {
  const attendance = await prisma.attendance.update({
    where: { id },
    data: {
      checkOut: new Date(),
      notes,
    },
  });

  await invalidateAttendanceCache(
    id,
    attendance.staffId,
    attendance.organizationId,
  );

  return attendance;
};

export const updateAttendance = async (
  id: string,
  data: AttendanceUpdateInput,
): Promise<Attendance> => {
  const attendance = await prisma.attendance.update({
    where: { id },
    data,
  });

  await invalidateAttendanceCache(
    id,
    attendance.staffId,
    attendance.organizationId,
  );

  return attendance;
};

const invalidateAttendanceCache = async (
  id: string,
  staffId: string,
  organizationId: string,
): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${id}`);
  await cacheDel(`${CACHE_PREFIX}staff:${staffId}:*`);
  await cacheDel(`${CACHE_PREFIX}org:${organizationId}:today`);
};
