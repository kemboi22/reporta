import type { Workspace, Prisma } from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const CACHE_TTL = 1800;
const CACHE_PREFIX = "workspace:";

export type WorkspaceCreateInput = Prisma.WorkspaceCreateInput;
export type WorkspaceUpdateInput = Prisma.WorkspaceUpdateInput;
export type WorkspaceWithRelations = Prisma.WorkspaceGetPayload<{
  include: {
    organization: true;
    users: true;
    projects: true;
    tasks: true;
  };
}>;

export const getWorkspaceById = async (id: string): Promise<Workspace | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}`;
  const cached = await cacheGet<Workspace>(cacheKey);
  if (cached) return cached;

  const workspace = await prisma.workspace.findUnique({
    where: { id },
  });

  if (workspace) {
    await cacheSet(cacheKey, workspace, CACHE_TTL);
  }

  return workspace;
}

export const getWorkspaceBySlug = async (slug: string): Promise<Workspace | null> => {
  const cacheKey = `${CACHE_PREFIX}slug:${slug}`;
  const cached = await cacheGet<Workspace>(cacheKey);
  if (cached) return cached;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
  });

  if (workspace) {
    await cacheSet(cacheKey, workspace, CACHE_TTL);
  }

  return workspace;
}

export const getWorkspaces = async (params?: {
  skip?: number;
  take?: number;
  where?: Prisma.WorkspaceWhereInput;
  include?: Prisma.WorkspaceInclude;
}): Promise<Workspace[]> => {
  const { skip = 0, take = 50, where, include } = params || {};

  return prisma.workspace.findMany({
    skip,
    take,
    where,
    include,
  });
}

export const createWorkspace = async (
  data: WorkspaceCreateInput
): Promise<Workspace> => {
  const workspace = await prisma.workspace.create({ data });

  const cacheKey = `${CACHE_PREFIX}${workspace.id}`;
  await cacheSet(cacheKey, workspace, CACHE_TTL);

  return workspace;
}

export const updateWorkspace = async (
  id: string,
  data: WorkspaceUpdateInput
): Promise<Workspace> => {
  const workspace = await prisma.workspace.update({
    where: { id },
    data,
  });

  await invalidateWorkspaceCache(id);

  return workspace;
}

export const deleteWorkspace = async (id: string): Promise<Workspace> => {
  const workspace = await prisma.workspace.delete({
    where: { id },
  });

  await invalidateWorkspaceCache(id);

  return workspace;
}

const invalidateWorkspaceCache = async (id: string): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${id}`);
  const ws = await prisma.workspace.findUnique({ where: { id }, select: { slug: true } });
  if (ws?.slug) {
    await cacheDel(`${CACHE_PREFIX}slug:${ws.slug}`);
  }
}
