import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const body = await readBody(event);
  
  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const dataAny = body as any;
  let userId = dataAny.userId;
  
  if (!userId) {
    const existingUser = await prisma.user.findUnique({
      where: { email: dataAny.email },
    });
    
    if (existingUser) {
      userId = existingUser.id;
    } else {
      const newUser = await prisma.user.create({
        data: {
          id: dataAny.email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 15),
          name: `${dataAny.firstName} ${dataAny.lastName}`,
          email: dataAny.email,
          firstName: dataAny.firstName,
          lastName: dataAny.lastName,
        },
      });
      userId = newUser.id;
    }
  }

  const staff = await prisma.staff.create({
    data: {
      ...body,
      organizationId,
      userId,
    },
    include: {
      user: true,
      department: true,
    },
  });
  
  setResponseStatus(event, 201);
  return staff;
});
