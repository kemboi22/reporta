import { getDocumentById } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Document ID is required" });
  }

  const document = await getDocumentById(id);
  
  if (!document) {
    throw createError({ statusCode: 404, message: "Document not found" });
  }
  
  return document;
});
