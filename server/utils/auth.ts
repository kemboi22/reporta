import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  admin,
  phoneNumber,
  twoFactor,
  username,
  customSession,
} from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { prisma } from "./db";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    twoFactor(),
    username(),
    phoneNumber(),
    admin(),

    passkey(),
    customSession(async ({ session, user }) => {
      const usr = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
        include: {
          organizationUsers: {
            include: {
              organization: true,
            },
          },
        },
      });
      return {
        user: {
          ...user,
          organizations: usr?.organizationUsers.map((ou) => ({
            id: ou.organization.id,
            name: ou.organization.name,
            slug: ou.organization.slug,
            role: ou.role,
          })),
        },
        session,
      };
    }),
    // emailOTP({
    //   sendVerificationOTP(data) {return data},
    // }),
  ],
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: "",
      clientSecret: "",
    },
  },
});
