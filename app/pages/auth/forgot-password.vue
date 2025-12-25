<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const email = ref("");
const isLoading = ref(false);
const emailSent = ref(false);

const handleResetRequest = async () => {
  isLoading.value = true;

  // Simulate API call
  setTimeout(() => {
    isLoading.value = false;
    emailSent.value = true;
  }, 1500);
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
          <div v-if="!emailSent">
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
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>

            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-foreground mb-2">
                Forgot Password?
              </h2>
              <p class="text-muted-foreground">
                No worries, we'll send you reset instructions
              </p>
            </div>

            <form @submit.prevent="handleResetRequest" class="space-y-6">
              <!-- Email field -->
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

              <!-- Submit button -->
              <Button
                type="submit"
                :disabled="isLoading"
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
                {{ isLoading ? "Sending..." : "Reset Password" }}
              </Button>

              <!-- Back to login -->
              <div class="text-center">
                <NuxtLink
                  to="/auth/login"
                  class="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to login
                </NuxtLink>
              </div>
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
                  d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                />
              </svg>
            </div>

            <h2 class="text-2xl font-bold text-foreground mb-2">
              Check Your Email
            </h2>
            <p class="text-muted-foreground mb-6">
              We've sent password reset instructions to
              <strong class="text-foreground">{{ email }}</strong>
            </p>

            <div class="bg-muted rounded-lg p-4 mb-6">
              <p class="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or
                <button
                  @click="emailSent = false"
                  class="text-primary hover:text-primary-hover font-medium"
                >
                  try another email address
                </button>
              </p>
            </div>

            <NuxtLink
              to="/auth/login"
              class="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to login
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
