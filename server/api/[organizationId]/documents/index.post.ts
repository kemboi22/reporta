import { createDocument } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const document = await createDocument(body);
  
  setResponseStatus(event, 201);
  return document;
});
