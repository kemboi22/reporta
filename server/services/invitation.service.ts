import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const CACHE_TTL = 1800;
const CACHE_PREFIX = "invitation:";

export type InvitationCreateInput = {
  organizationId: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  departmentId?: string;
  invitedBy: string;
  department?: string;
  position?: string;
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN" | "FREELANCE";
};

export type InvitationWithRelations = {
  id: string;
  email: string;
  role: string;
  status: string;
  token: string;
  expiresAt: Date;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  department: {
    id: string;
    name: string;
  } | null;
  inviter: {
    id: string;
    name: string;
    email: string;
  };
};

export const createInvitation = async (data: InvitationCreateInput) => {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const invitation = await prisma.userInvitation.create({
    data: {
      organizationId: data.organizationId,
      email: data.email.toLowerCase(),
      role: data.role,
      departmentId: data.departmentId,
      invitedBy: data.invitedBy,
      token,
      status: "PENDING",
      expiresAt,
    },
    include: {
      organization: true,
      department: true,
      inviter: true,
    },
  });

  return invitation;
};

export const getInvitationByToken = async (
  token: string,
): Promise<InvitationWithRelations | null> => {
  const cacheKey = `${CACHE_PREFIX}${token}`;
  const cached = await cacheGet<InvitationWithRelations>(cacheKey);
  if (cached) return cached;

  const invitation = await prisma.userInvitation.findUnique({
    where: { token },
    include: {
      organization: true,
      department: true,
      inviter: true,
    },
  });

  if (invitation) {
    await cacheSet(cacheKey, invitation, CACHE_TTL);
  }

  return invitation;
};

export const acceptInvitation = async (
  token: string,
  userId: string,
) => {
  const invitation = await prisma.userInvitation.findUnique({
    where: { token },
    include: { organization: true },
  });

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  if (invitation.status !== "PENDING") {
    throw new Error("Invitation is not valid");
  }

  if (invitation.expiresAt < new Date()) {
    await prisma.userInvitation.update({
      where: { id: invitation.id },
      data: { status: "EXPIRED" },
    });
    throw new Error("Invitation has expired");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.email.toLowerCase() !== invitation.email.toLowerCase()) {
    throw new Error("Email does not match invitation");
  }

  await prisma.$transaction(async (tx) => {
    await tx.organizationUser.upsert({
      where: {
        userId_organizationId: {
          userId,
          organizationId: invitation.organizationId,
        },
      },
      create: {
        userId,
        organizationId: invitation.organizationId,
        role: invitation.role,
      },
      update: {
        role: invitation.role,
      },
    });

    await tx.staff.upsert({
      where: {
        organizationId_userId: {
          organizationId: invitation.organizationId,
          userId,
        },
      },
      create: {
        organizationId: invitation.organizationId,
        userId,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        position: "",
        isActive: true,
        hireDate: new Date(),
        employmentType: "FULL_TIME",
      },
      update: {},
    });

    await tx.userInvitation.update({
      where: { id: invitation.id },
      data: {
        status: "ACCEPTED",
        acceptedBy: userId,
        acceptedAt: new Date(),
      },
    });
  });

  await invalidateInvitationCache(token);

  return invitation;
};

export const getPendingInvitations = async (
  organizationId: string,
): Promise<InvitationWithRelations[]> => {
  const invitations = await prisma.userInvitation.findMany({
    where: {
      organizationId,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    include: {
      organization: true,
      department: true,
      inviter: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return invitations;
};

export const deleteInvitation = async (id: string): Promise<void> => {
  await prisma.userInvitation.delete({
    where: { id },
  });
};

export const cancelInvitation = async (id: string): Promise<void> => {
  await prisma.userInvitation.update({
    where: { id },
    data: { status: "DECLINED" },
  });
};

export const resendInvitation = async (
  id: string,
): Promise<InvitationWithRelations> => {
  const newToken = crypto.randomUUID();
  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const invitation = await prisma.userInvitation.update({
    where: { id },
    data: {
      token: newToken,
      expiresAt: newExpiresAt,
      status: "PENDING",
    },
    include: {
      organization: true,
      department: true,
      inviter: true,
    },
  });

  return invitation;
};

const invalidateInvitationCache = async (token: string): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${token}`);
};
