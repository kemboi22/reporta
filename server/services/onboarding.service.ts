import { prisma } from "../utils/db";

export const checkSubdomainAvailability = async (
  subdomain: string
): Promise<{ available: boolean; message?: string }> => {
  const normalized = subdomain.toLowerCase().trim();
  
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(normalized)) {
    return {
      available: false,
      message: "Subdomain can only contain letters, numbers, and hyphens"
    };
  }

  if (normalized.length < 3 || normalized.length > 63) {
    return {
      available: false,
      message: "Subdomain must be between 3 and 63 characters"
    };
  }

  const existing = await prisma.organizationSettings.findUnique({
    where: { subdomain: normalized }
  });

  if (existing) {
    return {
      available: false,
      message: "This subdomain is already taken"
    };
  }

  return { available: true };
};

export const completeOnboarding = async (
  data: any
): Promise<any> => {
  const { organizationName, subdomain, organizationType, admin, settings, invitations, userId } = data;
  const normalizedSubdomain = subdomain.toLowerCase().trim();

  return await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: organizationName,
        slug: normalizedSubdomain,
        industry: organizationType,
      },
    });

    const orgSettings = await tx.organizationSettings.create({
      data: {
        organizationId: organization.id,
        subdomain: normalizedSubdomain,
        organizationType,
        timezone: settings.timezone,
        currency: settings.currency,
        workingHoursStart: settings.workingHoursStart,
        workingHoursEnd: settings.workingHoursEnd,
        weekendDays: settings.weekendDays,
        logo: settings.logo,
      },
    });

    let user;
    if (userId) {
      user = await tx.user.findUnique({
        where: { id: userId },
      });
      
      if (!user) {
        throw new Error("User not found");
      }
      
      await tx.user.update({
        where: { id: userId },
        data: {
          firstName: admin.firstName || user.firstName,
          lastName: admin.lastName || user.lastName,
        },
      });
    } else {
      user = await tx.user.create({
        data: {
          id: crypto.randomUUID(),
          email: admin.email.toLowerCase(),
          name: `${admin.firstName} ${admin.lastName}`,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: "ADMIN",
        },
      });
    }

    await tx.organizationUser.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: "OWNER",
      },
    });

    const workspaceSlug = `${normalizedSubdomain}-main`;
    const workspace = await tx.workspace.create({
      data: {
        organizationId: organization.id,
        name: "Main Workspace",
        slug: workspaceSlug,
      },
    });

    await tx.workspaceUser.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: "OWNER",
      },
    });

    await tx.staff.upsert({
      where: { userId: user.id },
      create: {
        organizationId: organization.id,
        userId: user.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        employeeId: `EMP-${Date.now()}`,
        isActive: true,
        hireDate: new Date(),
        employmentType: "FULL_TIME",
      },
      update: {
        organizationId: organization.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      },
    });

    let invitationsSent = 0;
    if (invitations.length > 0) {
      for (const email of invitations) {
        await tx.userInvitation.create({
          data: {
            organizationId: organization.id,
            email: email.toLowerCase(),
            role: "MEMBER",
            invitedBy: user.id,
            token: crypto.randomUUID(),
            status: "PENDING",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
        invitationsSent++;
      }
    }

    return {
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        subdomain: orgSettings.subdomain,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name || `${admin.firstName} ${admin.lastName}`,
      },
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
      invitationsSent,
    };
  });
};
