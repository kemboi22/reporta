<script setup lang="ts">
import { ref } from "vue";
import { navigateTo } from "#app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

const form = ref({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
});
const isLoading = ref(false);
const passwordStrength = ref(0);

const calculatePasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
  if (password.match(/\d/)) strength += 25;
  if (password.match(/[^a-zA-Z\d]/)) strength += 25;
  return strength;
};

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  isLoading.value = true;

  setTimeout(() => {
    navigateTo("/onboarding/step-1");
  }, 1500);
};

const onPasswordInput = () => {
  passwordStrength.value = calculatePasswordStrength(form.value.password);
};

const getStrengthColor = () => {
  if (passwordStrength.value <= 25) return "bg-red-500";
  if (passwordStrength.value <= 50) return "bg-amber-500";
  if (passwordStrength.value <= 75) return "bg-blue-500";
  return "bg-emerald-500";
};

const getStrengthText = () => {
  if (passwordStrength.value <= 25) return "Weak";
  if (passwordStrength.value <= 50) return "Fair";
  if (passwordStrength.value <= 75) return "Good";
  return "Strong";
};
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left side - Brand -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between relative overflow-hidden"
    >
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute inset-0"
          style="
            background-image: radial-gradient(
              circle at 1px 1px,
              white 1px,
              transparent 0
            );
            background-size: 40px 40px;
          "
        ></div>
      </div>

      <div class="relative z-10">
        <NuxtLink to="/" class="flex items-center gap-2 text-white">
          <div
            class="w-10 h-10 bg-white rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-primary"
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
          <span class="text-2xl font-bold">WorkForce</span>
        </NuxtLink>
      </div>

      <div class="relative z-10 text-white">
        <h1 class="text-4xl font-bold mb-4">Start Your Journey</h1>
        <p class="text-lg text-blue-100 mb-8">
          Join thousands of organizations streamlining their workforce
          management operations.
        </p>

        <!-- Features -->
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div
              class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">Biometric Attendance</h3>
              <p class="text-sm text-blue-100">
                Track attendance with advanced biometric integration
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">Comprehensive HR Tools</h3>
              <p class="text-sm text-blue-100">
                Manage staff, shifts, leaves, and appraisals in one place
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">Real-time Analytics</h3>
              <p class="text-sm text-blue-100">
                Get insights with powerful reporting and analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative z-10 text-blue-100 text-sm">
        © 2025 WorkForce. All rights reserved.
      </div>
    </div>

    <!-- Right side - Register form -->
    <div
      class="flex-1 flex items-center justify-center p-8 bg-muted/30 overflow-y-auto"
    >
      <div class="w-full max-w-md">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-foreground mb-2">
            Create Account
          </h2>
          <p class="text-muted-foreground">
            Get started with your free account
          </p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Full Name -->
          <div class="space-y-2">
            <Label for="fullName">Full Name</Label>
            <Input
              id="fullName"
              v-model="form.fullName"
              type="text"
              required
              placeholder="John Doe"
            />
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <Label for="email">Email Address</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="form.password"
              @input="onPasswordInput"
              type="password"
              required
              placeholder="••••••••"
            />
            <!-- Password strength indicator -->
            <div v-if="form.password" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">Password strength</span>
                <span
                  :class="getStrengthColor().replace('bg-', 'text-')"
                  class="font-medium"
                  >{{ getStrengthText() }}</span
                >
              </div>
              <div class="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  :class="getStrengthColor()"
                  :style="{ width: `${passwordStrength}%` }"
                  class="h-full transition-all duration-300"
                ></div>
              </div>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="space-y-2">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>

          <!-- Terms checkbox -->
          <div class="flex items-start gap-2">
            <Checkbox id="terms" v-model:checked="form.agreeToTerms" required />
            <Label for="terms" class="text-sm font-normal cursor-pointer">
              I agree to the
              <a href="#" class="text-primary hover:underline font-medium"
                >Terms of Service</a
              >
              and
              <a href="#" class="text-primary hover:underline font-medium"
                >Privacy Policy</a
              >
            </Label>
          </div>

          <!-- Submit button -->
          <Button
            type="submit"
            :disabled="isLoading || !form.agreeToTerms"
            class="w-full"
          >
            <svg
              v-if="isLoading"
              class="animate-spin h-5 w-5 mr-2"
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
            {{ isLoading ? "Creating account..." : "Create Account" }}
          </Button>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-border"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-muted/30 text-muted-foreground"
                >Or sign up with</span
              >
            </div>
          </div>

          <!-- Social signup -->
          <div class="grid grid-cols-2 gap-4">
            <Button type="button" variant="outline">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button type="button" variant="outline">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9998 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"
                />
              </svg>
              GitHub
            </Button>
          </div>
        </form>

        <p class="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?
          <NuxtLink
            to="/auth/login"
            class="text-primary hover:underline font-semibold"
          >
            Sign in
          </NuxtLink>
        </p>
      </div>
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
