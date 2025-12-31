import { deleteInvitation } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, message: "Invitation ID is required" });
  }

  await deleteInvitation(id);
  setResponseStatus(event, 204);
  return null;
});
