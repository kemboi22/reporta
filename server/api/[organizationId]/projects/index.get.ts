import { getProjects } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const { skip, take, status, departmentId } = getQuery(event);
  
  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const where: any = { workspace: { organizationId } };
  
  if (status) {
    where.status = status;
  }
  
  if (departmentId) {
    where.departmentId = departmentId;
  }

  const projects = await getProjects({
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    where,
    include: {
      workspace: true,
      department: true,
    },
    orderBy: { createdAt: "desc" },
  });
  
  return projects;
});
