import type { Document, Prisma } from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";
import { createHash } from "crypto";

const CACHE_TTL = 1800;
const CACHE_PREFIX = "document:";
const UPLOAD_DIR = "public/uploads/documents";

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
  orderBy?: Prisma.DocumentOrderByWithRelationInput;
}): Promise<Document[]> => {
  const { skip = 0, take = 50, where, include, orderBy } = params || {};

  return prisma.document.findMany({
    skip,
    take,
    where,
    include,
    orderBy: orderBy || { createdAt: "desc" },
  });
}

export const createDocument = async (
  data: any
): Promise<Document> => {
  const { file, uploadedBy, workspaceId, projectId, name, description, category, tags, visibility, isPinned } = data;

  let filePath = "";
  let fileSize = 0;
  let mimeType = "";

  if (file) {
    const timestamp = Date.now();
    const originalName = file.name || "document";
    const ext = originalName.split(".").pop();
    const sanitizedBaseName = originalName.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 50);
    const fileName = `${sanitizedBaseName}_${timestamp}.${ext}`;
    filePath = `/${UPLOAD_DIR}/${fileName}`;

    const fs = await import("fs/promises");
    const path = await import("path");
    
    const fullPath = path.join(process.cwd(), filePath);
    const buffer = Buffer.from(await file.arrayBuffer());
    fileSize = buffer.byteLength;
    mimeType = file.type || "application/octet-stream";

    await fs.mkdir(path.join(process.cwd(), UPLOAD_DIR), { recursive: true });
    await fs.writeFile(fullPath, buffer);
  }

  const document = await prisma.document.create({
    data: {
      name: name || (file ? file.name : "Untitled"),
      description,
      filePath,
      fileSize,
      mimeType,
      category,
      tags: tags || [],
      visibility: visibility || "WORKSPACE",
      uploadedBy,
      workspaceId,
      projectId: projectId || null,
      isPinned: isPinned || false,
      version: 1,
      downloadedBy: [],
    },
  });

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
};

export const generateShareLink = (documentId: string): string => {
  const token = createHash("sha256").update(documentId).digest("hex").substring(0, 16);
  return `/api/documents/share/${token}/${documentId}`;
};

export const verifyShareToken = (documentId: string, token: string): boolean => {
  const hash = createHash("sha256").update(documentId).digest("hex").substring(0, 16);
  return hash === token;
};

export const linkDocumentToTask = async (
  documentId: string,
  taskId: string
): Promise<void> => {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      attachments: {
        push: document.filePath,
      },
    },
  });
};

export const unlinkDocumentFromTask = async (
  documentId: string,
  taskId: string
): Promise<void> => {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      attachments: task.attachments.filter((path) => path !== document.filePath),
    },
  });
};

export const getDocumentsByTask = async (taskId: string): Promise<Document[]> => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return [];
  }

  if (!task.attachments || task.attachments.length === 0) {
    return [];
  }

  return prisma.document.findMany({
    where: {
      filePath: {
        in: task.attachments,
      },
    },
  });
};

export const recordDownload = async (documentId: string, userId: string): Promise<void> => {
  await prisma.document.update({
    where: { id: documentId },
    data: {
      downloadedBy: {
        push: userId,
      },
    },
  });

  await cacheDel(`${CACHE_PREFIX}${documentId}`);
};
