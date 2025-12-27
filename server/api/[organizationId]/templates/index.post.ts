import { createTemplate } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const template = await createTemplate(body);
  
  setResponseStatus(event, 201);
  return template;
});
