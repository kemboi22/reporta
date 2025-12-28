import { authClient } from "~/lib/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data } = await authClient.getSession();
  if (data && data.user) {
    return await navigateTo("/dashboard");
  }
});
