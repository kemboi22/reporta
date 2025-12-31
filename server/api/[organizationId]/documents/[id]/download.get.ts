import { getDocumentById, recordDownload } from "~~/server/services";
import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!id) {
    throw createError({ statusCode: 400, message: "Document ID is required" });
  }

  const document = await getDocumentById(id);

  if (!document) {
    throw createError({ statusCode: 404, message: "Document not found" });
  }

  if (session?.user?.id) {
    await recordDownload(id, session.user.id);
  }

  setHeader(event, "Content-Type", document.mimeType);
  setHeader(event, "Content-Disposition", `attachment; filename="${document.name}"`);

  const fs = await import("fs/promises");
  const path = await import("path");
  
  const filePath = path.join(process.cwd(), document.filePath);
  const fileBuffer = await fs.readFile(filePath);

  return fileBuffer;
});