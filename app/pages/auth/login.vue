<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { navigateTo } from "#app";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;

  setTimeout(() => {
    const hasWorkspaces = true;

    if (hasWorkspaces) {
      navigateTo("/dashboard");
    } else {
      navigateTo("/onboarding/step-1");
    }
  }, 1500);
};
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left side - Brand -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between relative overflow-hidden"
    >
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
        <h1 class="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p class="text-lg text-blue-100 mb-8">
          Manage your workforce operations with ease. Track attendance, manage
          HR tasks, and boost productivity.
        </p>

        <div class="grid grid-cols-3 gap-6">
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div class="text-3xl font-bold mb-1">5K+</div>
            <div class="text-sm text-blue-100">Active Users</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div class="text-3xl font-bold mb-1">99.9%</div>
            <div class="text-sm text-blue-100">Uptime</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div class="text-3xl font-bold mb-1">24/7</div>
            <div class="text-sm text-blue-100">Support</div>
          </div>
        </div>
      </div>

      <div class="relative z-10 text-blue-100 text-sm">
        © 2025 WorkForce. All rights reserved.
      </div>
    </div>

    <!-- Right side - Login form -->
    <div class="flex-1 flex items-center justify-center p-8 bg-muted/30">
      <Card class="w-full max-w-md border-border">
        <CardHeader>
          <CardTitle class="text-3xl">Sign In</CardTitle>
          <CardDescription
            >Enter your credentials to access your account</CardDescription
          >
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Using shadcn-vue form components -->
            <div class="space-y-2">
              <Label for="email">Email Address</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>

            <div class="space-y-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
              />
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Checkbox id="remember" v-model:checked="rememberMe" />
                <Label for="remember" class="text-sm font-normal cursor-pointer"
                  >Remember me</Label
                >
              </div>
              <NuxtLink
                to="/auth/forgot-password"
                class="text-sm text-primary hover:underline"
              >
                Forgot password?
              </NuxtLink>
            </div>

            <Button type="submit" :disabled="isLoading" class="w-full">
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
              <span>{{ isLoading ? "Signing in..." : "Sign In" }}</span>
            </Button>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-border"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-card text-muted-foreground"
                  >Or continue with</span
                >
              </div>
            </div>

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
                <svg
                  class="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9998 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"
                  />
                </svg>
                GitHub
              </Button>
            </div>
          </form>

          <p class="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?
            <NuxtLink
              to="/auth/register"
              class="text-primary hover:underline font-semibold"
            >
              Sign up for free
            </NuxtLink>
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
