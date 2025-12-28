import { createProject } from "~~/server/services";
import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  const { teamMembers, ...projectData } = body;
  projectData.createdBy = session?.user.id;

  const project = await createProject(projectData);

  if (teamMembers && teamMembers.length > 0) {
    await prisma.projectMember.createMany({
      data: teamMembers.map((userId: string) => ({
        projectId: project.id,
        userId,
        role: "MEMBER",
      })),
    });
  }

  const fullProject = await prisma.project.findUnique({
    where: { id: project.id },
    include: {
      members: { include: { user: true } },
    },
  });

  setResponseStatus(event, 201);
  return fullProject;
});
