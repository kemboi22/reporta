import { getProjects } from "~~/server/services";
import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const { skip, take, status, departmentId } = getQuery(event);
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  
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

  if (session?.user?.id) {
    where.members = {
      some: { userId: session.user.id },
    };
  }

  const projects = await getProjects({
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    where,
    include: {
      workspace: true,
      department: true,
      members: { include: { user: true } },
      tasks: true,
    },
    orderBy: { createdAt: "desc" },
  });
  
  return projects;
});
