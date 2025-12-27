import { updateTask } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Task ID is required" });
  }

  const task = await updateTask(id, body);
  
  return task;
});
