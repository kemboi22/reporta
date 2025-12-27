import { deleteTask } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Task ID is required" });
  }

  const task = await deleteTask(id);
  
  return task;
});
