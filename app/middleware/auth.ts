import { authClient } from "~/lib/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const session = authClient.useSession();
  if (!session.value.data) {
    return await navigateTo("/auth/login");
  }
});
