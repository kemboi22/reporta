import type { Document, Prisma } from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const CACHE_TTL = 1800;
const CACHE_PREFIX = "document:";

export type DocumentCreateInput = Prisma.DocumentCreateInput;
export type DocumentUpdateInput = Prisma.DocumentUpdateInput;
export type DocumentWithRelations = Prisma.DocumentGetPayload<{
  include: {
    workspace: true;
    project: true;
  };
}>;

export const getDocumentById = async (id: string): Promise<Document | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}`;
  const cached = await cacheGet<Document>(cacheKey);
  if (cached) return cached;

  const document = await prisma.document.findUnique({
    where: { id },
  });

  if (document) {
    await cacheSet(cacheKey, document, CACHE_TTL);
  }

  return document;
}

export const getDocuments = async (params?: {
  skip?: number;
  take?: number;
  where?: Prisma.DocumentWhereInput;
  include?: Prisma.DocumentInclude;
}): Promise<Document[]> => {
  const { skip = 0, take = 50, where, include } = params || {};

  return prisma.document.findMany({
    skip,
    take,
    where,
    include,
    orderBy: { createdAt: "desc" },
  });
}

export const createDocument = async (
  data: DocumentCreateInput
): Promise<Document> => {
  const document = await prisma.document.create({ data });

  const cacheKey = `${CACHE_PREFIX}${document.id}`;
  await cacheSet(cacheKey, document, CACHE_TTL);

  return document;
}

export const updateDocument = async (
  id: string,
  data: DocumentUpdateInput
): Promise<Document> => {
  const document = await prisma.document.update({
    where: { id },
    data,
  });

  await invalidateDocumentCache(id, document.workspaceId);

  return document;
}

export const deleteDocument = async (id: string): Promise<Document> => {
  const document = await prisma.document.delete({
    where: { id },
  });

  await invalidateDocumentCache(id, document.workspaceId);

  return document;
}

const invalidateDocumentCache = async (id: string, workspaceId: string): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${id}`);
}
