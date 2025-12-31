import { getOrganizations } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const { auth } = await import("~~/server/utils/auth");
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const { skip, take } = getQuery(event);
  const organizations = await getOrganizations({
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    where: {
      users: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      users: {
        where: {
          userId: session.user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      workspaces: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return organizations;
});
