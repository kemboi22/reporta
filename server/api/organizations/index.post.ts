import { createOrganization } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const organization = await createOrganization(body);
  setResponseStatus(event, 201);
  return organization;
});
