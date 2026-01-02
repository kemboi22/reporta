import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const body = await readBody(event);

  if (!organizationId) {
    throw createError({
      statusCode: 400,
      message: "Organization ID is required",
    });
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
      const dt = await auth.api.signUpEmail({
        body: {
          name: dataAny.email,
          email: dataAny.email,
          password: dataAny.phone,
        },
      });
      userId = dt.user.id;
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
