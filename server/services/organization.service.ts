import type { Organization, Prisma } from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const CACHE_TTL = 3600;
const CACHE_PREFIX = "organization:";

export type OrganizationCreateInput = Prisma.OrganizationCreateInput;
export type OrganizationUpdateInput = Prisma.OrganizationUpdateInput;
export type OrganizationWithRelations = Prisma.OrganizationGetPayload<{
  include: {
    users: true;
    workspaces: true;
    settings: true;
  };
}>;

export const getOrganizationById = async (
  id: string,
): Promise<Organization | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}`;
  const cached = await cacheGet<Organization>(cacheKey);
  if (cached) return cached;

  const organization = await prisma.organization.findUnique({
    where: { id },
  });

  if (organization) {
    await cacheSet(cacheKey, organization, CACHE_TTL);
  }

  return organization;
};

export const getOrganizationBySlug = async (
  slug: string,
): Promise<Organization | null> => {
  const cacheKey = `${CACHE_PREFIX}slug:${slug}`;
  const cached = await cacheGet<Organization>(cacheKey);
  if (cached) return cached;

  const organization = await prisma.organization.findUnique({
    where: { slug },
  });

  if (organization) {
    await cacheSet(cacheKey, organization, CACHE_TTL);
  }

  return organization;
};

export const getOrganizations = async (params?: {
  skip?: number;
  take?: number;
  where?: Prisma.OrganizationWhereInput;
  include?: Prisma.OrganizationInclude;
}): Promise<Organization[]> => {
  const { skip = 0, take = 50, where, include } = params || {};

  return prisma.organization.findMany({
    skip,
    take,
    where,
    include,
  });
};

export const createOrganization = async (
  data: OrganizationCreateInput,
): Promise<Organization> => {
  const organization = await prisma.organization.create({ data });

  const cacheKey = `${CACHE_PREFIX}${organization.id}`;
  await cacheSet(cacheKey, organization, CACHE_TTL);

  return organization;
};

export const updateOrganization = async (
  id: string,
  data: OrganizationUpdateInput,
): Promise<Organization> => {
  const organization = await prisma.organization.update({
    where: { id },
    data,
  });

  await invalidateOrganizationCache(id);

  return organization;
};

export const deleteOrganization = async (id: string): Promise<Organization> => {
  const organization = await prisma.organization.delete({
    where: { id },
  });

  await invalidateOrganizationCache(id);

  return organization;
};

const invalidateOrganizationCache = async (id: string): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${id}`);
  const org = await prisma.organization.findUnique({
    where: { id },
    select: { slug: true },
  });
  if (org?.slug) {
    await cacheDel(`${CACHE_PREFIX}slug:${org.slug}`);
  }
};
