import { authClient } from "~/lib/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data } = await authClient.getSession();
  if (data && data.user) {
    let organizations = data.user.organizations;
    if (organizations && organizations.length) {
      return await navigateTo(`/${organizations[0]?.id}/dashboard`);
    } else {
      return await navigateTo("/onboarding/step-1");
    }
  }
});
