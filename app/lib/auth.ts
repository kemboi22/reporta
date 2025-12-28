import { passkeyClient } from "@better-auth/passkey/client";
import {
  adminClient,
  twoFactorClient,
  usernameClient,
  phoneNumberClient,
  customSessionClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";
export const authClient = createAuthClient({
  plugins: [
    customSessionClient<typeof auth>(),
    inferAdditionalFields<typeof auth>(),
    twoFactorClient(),
    usernameClient(),
    phoneNumberClient(),
    adminClient(),
    passkeyClient(),
  ],
});
