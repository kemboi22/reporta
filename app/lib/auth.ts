import { passkey } from "@better-auth/passkey";
import { admin, phoneNumber, twoFactor, username } from "better-auth/plugins";
import { createAuthClient } from "better-auth/vue";
export const authClient = createAuthClient({
  plugins: [twoFactor(), username(), phoneNumber(), admin(), passkey()],
});
