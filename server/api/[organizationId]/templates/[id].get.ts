import { getTemplateById } from "~~/server/services";
import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Template ID is required" });
  }

  const template = await getTemplateById(id);
  
  if (!template) {
    throw createError({ statusCode: 404, message: "Template not found" });
  }
  
  const templateWithWorkspace = await prisma.reportTemplate.findUnique({
    where: { id },
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
  
  return templateWithWorkspace;
});
