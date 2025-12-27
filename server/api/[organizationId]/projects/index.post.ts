import { createProject } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const project = await createProject(body);
  
  setResponseStatus(event, 201);
  return project;
});
