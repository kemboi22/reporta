import type { Task, Prisma } from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const CACHE_TTL = 600;
const CACHE_PREFIX = "task:";

export type TaskCreateInput = Prisma.TaskCreateInput;
export type TaskUpdateInput = Prisma.TaskUpdateInput;
export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    workspace: true;
    project: true;
    milestone: true;
    assignees: { include: { user: true } };
    comments: true;
    timeLogs: true;
    checklist: true;
  };
}>;

export const getTaskById = async (id: string): Promise<Task | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}`;
  const cached = await cacheGet<Task>(cacheKey);
  if (cached) return cached;

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (task) {
    await cacheSet(cacheKey, task, CACHE_TTL);
  }

  return task;
}

export const getTasks = async (params?: {
  skip?: number;
  take?: number;
  where?: Prisma.TaskWhereInput;
  include?: Prisma.TaskInclude;
  orderBy?: Prisma.TaskOrderByWithRelationInput;
}): Promise<Task[]> => {
  const { skip = 0, take = 50, where, include, orderBy } = params || {};

  return prisma.task.findMany({
    skip,
    take,
    where,
    include,
    orderBy,
  });
}

export const createTask = async (data: TaskCreateInput): Promise<Task> => {
  const task = await prisma.task.create({ data });

  const cacheKey = `${CACHE_PREFIX}${task.id}`;
  await cacheSet(cacheKey, task, CACHE_TTL);

  return task;
}

export const updateTask = async (id: string, data: TaskUpdateInput): Promise<Task> => {
  const task = await prisma.task.update({
    where: { id },
    data,
  });

  await invalidateTaskCache(id);

  return task;
}

export const deleteTask = async (id: string): Promise<Task> => {
  const task = await prisma.task.delete({
    where: { id },
  });

  await invalidateTaskCache(id);

  return task;
}

const invalidateTaskCache = async (id: string): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${id}`);
}
