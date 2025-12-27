import type { Department, Prisma } from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const CACHE_TTL = 3600;
const CACHE_PREFIX = "department:";

export type DepartmentCreateInput = Prisma.DepartmentCreateInput;
export type DepartmentUpdateInput = Prisma.DepartmentUpdateInput;
export type DepartmentWithRelations = Prisma.DepartmentGetPayload<{
  include: {
    organization: true;
    head: true;
    staff: true;
    projects: true;
    users: true;
  };
}>;

export const getDepartmentById = async (id: string): Promise<Department | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}`;
  const cached = await cacheGet<Department>(cacheKey);
  if (cached) return cached;

  const department = await prisma.department.findUnique({
    where: { id },
  });

  if (department) {
    await cacheSet(cacheKey, department, CACHE_TTL);
  }

  return department;
}

export const getDepartments = async (params?: {
  skip?: number;
  take?: number;
  where?: Prisma.DepartmentWhereInput;
  include?: Prisma.DepartmentInclude;
}): Promise<Department[]> => {
  const { skip = 0, take = 50, where, include } = params || {};

  return prisma.department.findMany({
    skip,
    take,
    where,
    include,
  });
}

export const createDepartment = async (
  data: DepartmentCreateInput
): Promise<Department> => {
  const department = await prisma.department.create({ data });

  const cacheKey = `${CACHE_PREFIX}${department.id}`;
  await cacheSet(cacheKey, department, CACHE_TTL);

  return department;
}

export const updateDepartment = async (
  id: string,
  data: DepartmentUpdateInput
): Promise<Department> => {
  const department = await prisma.department.update({
    where: { id },
    data,
  });

  await invalidateDepartmentCache(id);

  return department;
}

export const deleteDepartment = async (id: string): Promise<Department> => {
  const department = await prisma.department.delete({
    where: { id },
  });

  await invalidateDepartmentCache(id);

  return department;
}

const invalidateDepartmentCache = async (id: string): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${id}`);
}
