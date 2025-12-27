import { getTaskById } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Task ID is required" });
  }

  const task = await getTaskById(id);
  
  if (!task) {
    throw createError({ statusCode: 404, message: "Task not found" });
  }
  
  return task;
});
