import { passkeyClient } from "@better-auth/passkey/client";
import {
  adminClient,
  twoFactorClient,
  usernameClient,
  phoneNumberClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";
export const authClient = createAuthClient({
  plugins: [
    twoFactorClient(),
    usernameClient(),
    phoneNumberClient(),
    adminClient(),
    passkeyClient(),
  ],
});
