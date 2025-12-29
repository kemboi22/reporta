import type { Project, Prisma } from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const CACHE_TTL = 1800;
const CACHE_PREFIX = "project:";

export type ProjectCreateInput = Prisma.ProjectCreateInput;
export type ProjectUpdateInput = Prisma.ProjectUpdateInput;
export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    workspace: true;
    department: true;
    tasks: true;
    members: { include: { user: true } };
    documents: true;
    milestones: true;
  };
}>;

export const getProjectByIdWithRelations = async (
  id: string,
): Promise<ProjectWithRelations | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}:relations`;
  const cached = await cacheGet<ProjectWithRelations>(cacheKey);
  if (cached) return cached;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      workspace: true,
      department: true,
      tasks: { include: { assignees: { include: { user: true } } } },
      members: { include: { user: true } },
      documents: true,
      milestones: true,
    },
  });

  if (project) {
    await cacheSet(cacheKey, project, CACHE_TTL);
  }

  return project;
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}`;
  const cached = await cacheGet<Project>(cacheKey);
  if (cached) return cached;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (project) {
    await cacheSet(cacheKey, project, CACHE_TTL);
  }

  return project;
};

export const getProjectBySlug = async (
  workspaceId: string,
  slug: string,
): Promise<Project | null> => {
  const cacheKey = `${CACHE_PREFIX}ws:${workspaceId}:slug:${slug}`;
  const cached = await cacheGet<Project>(cacheKey);
  if (cached) return cached;

  const project = await prisma.project.findUnique({
    where: {
      workspaceId_slug: {
        workspaceId,
        slug,
      },
    },
  });

  if (project) {
    await cacheSet(cacheKey, project, CACHE_TTL);
  }

  return project;
};

export const getProjects = async (params?: {
  skip?: number;
  take?: number;
  where?: Prisma.ProjectWhereInput;
  include?: Prisma.ProjectInclude;
  orderBy?: Prisma.ProjectOrderByWithRelationInput;
}): Promise<Project[]> => {
  const { skip = 0, take = 50, where, include, orderBy } = params || {};

  return prisma.project.findMany({
    skip,
    take,
    where,
    include,
    orderBy,
  });
};

export const createProject = async (
  data: ProjectCreateInput,
): Promise<Project> => {
  const project = await prisma.project.create({ data });

  const cacheKey = `${CACHE_PREFIX}${project.id}`;
  await cacheSet(cacheKey, project, CACHE_TTL);

  return project;
};

export const updateProject = async (
  id: string,
  data: ProjectUpdateInput,
): Promise<Project> => {
  const project = await prisma.project.update({
    where: { id },
    data,
  });

  await invalidateProjectCache(id);

  return project;
};

export const deleteProject = async (id: string): Promise<Project> => {
  const project = await prisma.project.delete({
    where: { id },
  });

  await invalidateProjectCache(id);

  return project;
};

const invalidateProjectCache = async (id: string): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${id}`);
};
