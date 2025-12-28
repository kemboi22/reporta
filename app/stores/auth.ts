import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import { authClient } from "~/lib/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>();
  const loading = ref(false);

  const login = async (form: any) => {
    loading.value = true;
    try {
      const { data, error } = await authClient.signIn.email({
        ...form,
      });
      if (error && error.message) {
        toast.error(error.message);
        return;
      }
      if (data?.user) {
        user.value = data?.user;
        await navigateTo("/dashboard");
        toast.success("Successfully signed in");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      loading.value = false;
    }
  };
  const register = async () => {};

  return {
    user,

    login,
    register,
  };
});
