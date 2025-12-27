import type { User, Prisma } from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const CACHE_TTL = 1800;
const CACHE_PREFIX = "user:";

export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    sessions: true;
    organizationUsers: true;
    workspaceUsers: true;
    notifications: true;
    staff: true;
  };
}>;

export const getUserById = async (id: string): Promise<User | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}`;
  const cached = await cacheGet<User>(cacheKey);
  if (cached) return cached;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (user) {
    await cacheSet(cacheKey, user, CACHE_TTL);
  }

  return user;
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const cacheKey = `${CACHE_PREFIX}email:${email}`;
  const cached = await cacheGet<User>(cacheKey);
  if (cached) return cached;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    await cacheSet(cacheKey, user, CACHE_TTL);
  }

  return user;
}



export const getUsers = async (params?: {
  skip?: number;
  take?: number;
  where?: Prisma.UserWhereInput;
  include?: Prisma.UserInclude;
}): Promise<User[]> => {
  const { skip = 0, take = 50, where, include } = params || {};

  return prisma.user.findMany({
    skip,
    take,
    where,
    include,
  });
}

export const createUser = async (data: UserCreateInput): Promise<User> => {
  const user = await prisma.user.create({ data });

  await invalidateUserCache(user.id, user.email);

  return user;
}

export const updateUser = async (id: string, data: UserUpdateInput): Promise<User> => {
  const currentUser = await prisma.user.findUnique({
    where: { id },
    select: { email: true },
  });

  const user = await prisma.user.update({
    where: { id },
    data,
  });

  if (currentUser) {
    await invalidateUserCache(id, currentUser.email);
  }

  return user;
}

export const deleteUser = async (id: string): Promise<User> => {
  const currentUser = await prisma.user.findUnique({
    where: { id },
    select: { email: true },
  });

  const user = await prisma.user.delete({
    where: { id },
  });

  if (currentUser) {
    await invalidateUserCache(id, currentUser.email);
  }

  return user;
}

const invalidateUserCache = async (
  id: string,
  email?: string | null
): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${id}`);
  if (email) await cacheDel(`${CACHE_PREFIX}email:${email}`);
}
