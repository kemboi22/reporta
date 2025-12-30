import { deleteTemplate } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Template ID is required" });
  }

  const template = await deleteTemplate(id);
  
  return template;
});
