import { createTask, TaskCreateInput } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as TaskCreateInput;
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  if (session?.user) {
    body.assignedBy = session.user.id;
  }

  const task = await createTask(body);

  setResponseStatus(event, 201);
  return task;
});
