import { getOrganizations } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const { skip, take } = getQuery(event);
  const organizations = await getOrganizations({
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
  });
  return organizations;
});
