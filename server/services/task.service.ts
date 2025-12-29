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
    include: {
      assignees: { include: { user: true } },
      comments: true,
      checklist: true,
      timeLogs: true,
    },
  });

  if (task) {
    await cacheSet(cacheKey, task, CACHE_TTL);
  }

  return task;
};

export const getTasks = async (params?: {
  skip?: number;
  take?: number;
  where?: Prisma.TaskWhereInput;
  include?: Prisma.TaskInclude;
  orderBy?: Prisma.TaskOrderByWithRelationInput;
}): Promise<Task[]> => {
  const { skip = 0, take = 50, where, include, orderBy } = params || {};

  const defaultInclude: Prisma.TaskInclude = {
    assignees: { include: { user: true } },
  };

  return prisma.task.findMany({
    skip,
    take,
    where,
    include: include || defaultInclude,
    orderBy,
  });
};

export const createTask = async (data: any): Promise<Task> => {
  const { assigneeIds, ...taskData } = data;
  
  const task = await prisma.task.create({
    data: {
      ...taskData,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate.toString()) : undefined,
    },
  });

  if (assigneeIds && assigneeIds.length > 0) {
    const staffRecords = await prisma.staff.findMany({
      where: {
        id: { in: assigneeIds },
        userId: { not: null },
      },
      select: { userId: true },
    });

    const validUserIds = staffRecords
      .map((s: any) => s.userId)
      .filter((id: string | null) => id !== null) as string[];

    if (validUserIds.length > 0) {
      await prisma.taskAssignee.createMany({
        data: validUserIds.map((userId) => ({
          taskId: task.id,
          userId,
        })),
        skipDuplicates: true,
      });
    }
  }

  const cacheKey = `${CACHE_PREFIX}${task.id}`;
  await cacheSet(cacheKey, task, CACHE_TTL);

  return task;
};

export const updateTask = async (id: string, data: any): Promise<Task> => {
  const { assigneeIds, ...taskData } = data;

  const task = await prisma.task.update({
    where: { id },
    data: taskData,
  });

  if (assigneeIds !== undefined) {
    await prisma.taskAssignee.deleteMany({
      where: { taskId: id },
    });

    if (assigneeIds.length > 0) {
      const staffRecords = await prisma.staff.findMany({
        where: {
          id: { in: assigneeIds },
          userId: { not: null },
        },
        select: { userId: true },
      });

      const validUserIds = staffRecords
        .map((s: any) => s.userId)
        .filter((id: string | null) => id !== null) as string[];

      if (validUserIds.length > 0) {
        await prisma.taskAssignee.createMany({
          data: validUserIds.map((userId) => ({
            taskId: id,
            userId,
          })),
          skipDuplicates: true,
        });
      }
    }
  }

  await invalidateTaskCache(id);

  return task;
};

export const deleteTask = async (id: string): Promise<Task> => {
  const task = await prisma.task.delete({
    where: { id },
  });

  await invalidateTaskCache(id);

  return task;
};

const invalidateTaskCache = async (id: string): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${id}`);
};
