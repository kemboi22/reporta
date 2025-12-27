import { deleteDocument } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Document ID is required" });
  }

  const document = await deleteDocument(id);
  
  return document;
});
