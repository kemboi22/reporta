import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  admin,
  emailOTP,
  phoneNumber,
  twoFactor,
  username,
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
    admin({
      defaultRole: "user",
    }),
    passkey(),
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
