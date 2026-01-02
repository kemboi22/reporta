<script setup lang="ts">
import { toast } from "vue-sonner";
import { authClient } from "~/lib/auth";

const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const passwordReset = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const route = useRoute();
const token = route.query.token;

const passwordStrength = computed(() => {
  let strength = 0;
  if (password.value.length >= 8) strength += 25;
  if (password.value.match(/[a-z]/) && password.value.match(/[A-Z]/))
    strength += 25;
  if (password.value.match(/\d/)) strength += 25;
  if (password.value.match(/[^a-zA-Z\d]/)) strength += 25;
  return strength;
});

const getStrengthColor = computed(() => {
  if (passwordStrength.value <= 25) return "bg-danger";
  if (passwordStrength.value <= 50) return "bg-warning";
  if (passwordStrength.value <= 75) return "bg-info";
  return "bg-success";
});

const getStrengthText = computed(() => {
  if (passwordStrength.value <= 25) return "Weak";
  if (passwordStrength.value <= 50) return "Fair";
  if (passwordStrength.value <= 75) return "Good";
  return "Strong";
});

const passwordsMatch = computed(() => {
  return (
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value
  );
});

const handleResetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }
  const { data, error } = await authClient.resetPassword({
    newPassword: password.value,
    token: token as string,
  });
  if (error && error.message) {
    toast.error(error.message);
    return;
  }
  if (data?.status) {
    toast.success("Reset Password");
    await navigateTo("/auth/login");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-muted">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div
            class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span class="text-2xl font-bold text-foreground">WorkForce</span>
        </NuxtLink>
      </div>

      <!-- Card -->
      <Card>
        <CardContent class="p-8">
          <div v-if="!passwordReset">
            <!-- Icon -->
            <div
              class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                class="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-foreground mb-2">
                Set New Password
              </h2>
              <p class="text-muted-foreground">
                Your new password must be different from previous passwords
              </p>
            </div>

            <form @submit.prevent="handleResetPassword" class="space-y-6">
              <!-- New Password -->
              <div class="space-y-2">
                <Label for="password">New Password</Label>
                <div class="relative">
                  <Input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      v-if="!showPassword"
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </button>
                </div>
                <!-- Password strength indicator -->
                <div v-if="password" class="space-y-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-muted-foreground">Password strength</span>
                    <span
                      :class="getStrengthColor.replace('bg-', 'text-')"
                      class="font-medium"
                      >{{ getStrengthText }}</span
                    >
                  </div>
                  <div class="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      :class="getStrengthColor"
                      :style="{ width: `${passwordStrength}%` }"
                      class="h-full transition-all duration-300"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-2">
                <Label for="confirmPassword">Confirm Password</Label>
                <div class="relative">
                  <Input
                    id="confirmPassword"
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      v-if="!showConfirmPassword"
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </button>
                </div>
                <!-- Match indicator -->
                <div
                  v-if="confirmPassword"
                  class="flex items-center gap-1 text-xs"
                >
                  <svg
                    v-if="passwordsMatch"
                    class="w-4 h-4 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4 text-danger"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span
                    :class="passwordsMatch ? 'text-success' : 'text-danger'"
                  >
                    {{
                      passwordsMatch
                        ? "Passwords match"
                        : "Passwords do not match"
                    }}
                  </span>
                </div>
              </div>

              <!-- Password requirements -->
              <div
                class="bg-muted rounded-lg p-4 text-sm text-muted-foreground space-y-1"
              >
                <p class="font-medium text-foreground mb-2">
                  Password must contain:
                </p>
                <div class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4"
                    :class="
                      password.length >= 8
                        ? 'text-success'
                        : 'text-muted-foreground'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>At least 8 characters</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4"
                    :class="
                      password.match(/[a-z]/) && password.match(/[A-Z]/)
                        ? 'text-success'
                        : 'text-muted-foreground'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>Upper & lowercase letters</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4"
                    :class="
                      password.match(/\d/)
                        ? 'text-success'
                        : 'text-muted-foreground'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>At least one number</span>
                </div>
              </div>

              <!-- Submit button -->
              <Button
                type="submit"
                :disabled="isLoading || !passwordsMatch"
                class="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ isLoading ? "Resetting..." : "Reset Password" }}
              </Button>
            </form>
          </div>

          <!-- Success state -->
          <div v-else class="text-center">
            <!-- Success icon -->
            <div
              class="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                class="w-8 h-8 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 class="text-2xl font-bold text-foreground mb-2">
              Password Reset!
            </h2>
            <p class="text-muted-foreground mb-6">
              Your password has been successfully reset. You can now sign in
              with your new password.
            </p>

            <NuxtLink
              to="/auth/login"
              class="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition-all"
            >
              Continue to Sign In
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
