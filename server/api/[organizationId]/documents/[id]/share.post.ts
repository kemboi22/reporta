import { getDocumentById, generateShareLink, verifyShareToken } from "~~/server/services";
import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!id) {
    throw createError({ statusCode: 400, message: "Document ID is required" });
  }

  const body = await readBody(event);
  const { visibility, allowDownload } = body;

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const document = await getDocumentById(id);

  if (!document) {
    throw createError({ statusCode: 404, message: "Document not found" });
  }

  const baseUrl = getRequestURL(event).origin;
  const shareLink = `${baseUrl}${generateShareLink(id)}`;

  return {
    document,
    shareLink,
  };
});