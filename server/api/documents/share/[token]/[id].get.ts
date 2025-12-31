import { getDocumentById, verifyShareToken } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, "token");
  const id = getRouterParam(event, "id");

  if (!id || !token) {
    throw createError({ statusCode: 400, message: "Document ID and token are required" });
  }

  const document = await getDocumentById(id);

  if (!document) {
    throw createError({ statusCode: 404, message: "Document not found" });
  }

  if (document.visibility !== "PUBLIC") {
    throw createError({ statusCode: 403, message: "Document is not publicly shareable" });
  }

  setHeader(event, "Content-Type", document.mimeType);
  setHeader(event, "Content-Disposition", `attachment; filename="${document.name}"`);

  const fs = await import("fs/promises");
  const path = await import("path");
  
  const filePath = path.join(process.cwd(), document.filePath);
  const fileBuffer = await fs.readFile(filePath);

  return fileBuffer;
});