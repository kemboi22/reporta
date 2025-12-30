import { updateTemplate } from "~~/server/services";
import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Template ID is required" });
  }

  const template = await updateTemplate(id, body);
  
  return template;
});
