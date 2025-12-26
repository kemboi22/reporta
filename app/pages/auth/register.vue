<script setup lang="ts">
import { ref } from "vue";
import { navigateTo } from "#app";
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
import ThemeToggle from "~/components/ThemeToggle.vue";

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
  <div class="min-h-screen bg-background relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 -z-10">
      <!-- Gradient Orbs -->
      <div
        class="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"
      ></div>
      <div
        class="absolute top-0 -right-4 w-96 h-96 bg-purple-300/30 dark:bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300/30 dark:bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"
      ></div>

      <!-- Grid Pattern -->
      <div
        class="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"
      ></div>
    </div>

    <!-- Theme Toggle -->
    <div class="absolute top-6 right-6 z-50">
      <ThemeToggle />
    </div>

    <!-- Main Content -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div
        class="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
      >
        <!-- Left Side - Branding & Info -->
        <div class="space-y-8 text-center lg:text-left">
          <!-- Logo -->
          <NuxtLink to="/" class="inline-flex items-center gap-3 group">
            <div
              class="relative w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110"
            >
              <div
                class="absolute inset-0 bg-white/20 rounded-2xl blur-xl"
              ></div>
              <svg
                class="relative w-8 h-8 text-white"
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
            <span
              class="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
              >WorkForce</span
            >
          </NuxtLink>

          <!-- Hero Text -->
          <div class="space-y-4">
            <h1
              class="text-4xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
            >
              Start Your
              <span class="block text-primary">Journey Today</span>
            </h1>
            <p
              class="text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0"
            >
              Join thousands of organizations transforming their workforce management with cutting-edge tools designed for modern businesses.
            </p>
          </div>

          <!-- Feature Pills -->
          <div class="flex flex-wrap gap-3 justify-center lg:justify-start">
            <div
              class="px-4 py-2 bg-card border border-border/50 rounded-full shadow-sm backdrop-blur-sm"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                ></div>
                <span class="text-sm font-medium">Quick Setup</span>
              </div>
            </div>
            <div
              class="px-4 py-2 bg-card border border-border/50 rounded-full shadow-sm backdrop-blur-sm"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-1000"
                ></div>
                <span class="text-sm font-medium">Free Trial</span>
              </div>
            </div>
            <div
              class="px-4 py-2 bg-card border border-border/50 rounded-full shadow-sm backdrop-blur-sm"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-2000"
                ></div>
                <span class="text-sm font-medium">24/7 Support</span>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-6 pt-8">
            <div class="space-y-1">
              <div class="text-3xl lg:text-4xl font-bold text-foreground">
                5K+
              </div>
              <div class="text-xs lg:text-sm text-muted-foreground">
                Companies
              </div>
            </div>
            <div class="space-y-1">
              <div class="text-3xl lg:text-4xl font-bold text-foreground">
                99.9%
              </div>
              <div class="text-xs lg:text-sm text-muted-foreground">Uptime</div>
            </div>
            <div class="space-y-1">
              <div class="text-3xl lg:text-4xl font-bold text-foreground">
                24/7
              </div>
              <div class="text-xs lg:text-sm text-muted-foreground">
                Support
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Register Form -->
        <div class="w-full max-w-lg mx-auto">
          <Card
            class="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/95"
          >
            <CardHeader class="space-y-3 text-center">
              <div
                class="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2"
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <CardTitle class="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription class="text-base">
                Start your free trial today
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Social Login Buttons (Top) -->
              <div class="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  class="w-full h-11 font-medium hover:bg-accent hover:border-primary/20 transition-all group"
                >
                  <svg
                    class="w-5 h-5 mr-2 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                  >
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
                  Continue with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  class="w-full h-11 font-medium hover:bg-accent hover:border-primary/20 transition-all group"
                >
                  <svg
                    class="w-5 h-5 mr-2 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9998 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"
                    />
                  </svg>
                  Continue with GitHub
                </Button>
              </div>

              <!-- Divider -->
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-border"></div>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                  <span class="px-3 bg-card text-muted-foreground font-medium">
                    Or with email
                  </span>
                </div>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleRegister" class="space-y-4">
                <!-- Full Name field -->
                <div class="space-y-2">
                  <Label for="fullName" class="text-sm font-medium">Full Name</Label>
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 left-3 flex items-center pointer-events-none"
                    >
                      <svg
                        class="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <Input
                      id="fullName"
                      v-model="form.fullName"
                      type="text"
                      required
                      placeholder="John Doe"
                      class="h-12 pl-11 border-border/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <!-- Email field -->
                <div class="space-y-2">
                  <Label for="email" class="text-sm font-medium">Email</Label>
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 left-3 flex items-center pointer-events-none"
                    >
                      <svg
                        class="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <Input
                      id="email"
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      class="h-12 pl-11 border-border/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <!-- Password field -->
                <div class="space-y-2">
                  <Label for="password" class="text-sm font-medium">Password</Label>
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 left-3 flex items-center pointer-events-none"
                    >
                      <svg
                        class="w-5 h-5 text-muted-foreground"
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
                    <Input
                      id="password"
                      v-model="form.password"
                      @input="onPasswordInput"
                      type="password"
                      required
                      placeholder="••••••••"
                      class="h-12 pl-11 border-border/50 focus:border-primary transition-all"
                    />
                  </div>
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

                <!-- Confirm Password field -->
                <div class="space-y-2">
                  <Label for="confirmPassword" class="text-sm font-medium"
                    >Confirm Password</Label
                  >
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 left-3 flex items-center pointer-events-none"
                    >
                      <svg
                        class="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <Input
                      id="confirmPassword"
                      v-model="form.confirmPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      class="h-12 pl-11 border-border/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <!-- Terms checkbox -->
                <div class="flex items-start gap-2">
                  <Checkbox id="terms" v-model:checked="form.agreeToTerms" required />
                  <Label for="terms" class="text-sm font-normal cursor-pointer">
                    I agree to the
                    <NuxtLink to="/terms" class="text-primary hover:underline font-medium"
                      >Terms of Service</NuxtLink
                    >
                    and
                    <NuxtLink to="/privacy" class="text-primary hover:underline font-medium"
                      >Privacy Policy</NuxtLink
                    >
                  </Label>
                </div>

                <!-- Sign up button -->
                <Button
                  type="submit"
                  :disabled="isLoading || !form.agreeToTerms"
                  class="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  size="lg"
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
              </form>

              <!-- Sign in link -->
              <p class="text-center text-sm text-muted-foreground pt-2">
                Already have an account?
                <NuxtLink
                  to="/auth/login"
                  class="text-primary hover:text-primary/80 font-semibold transition-colors ml-1"
                >
                  Sign In
                </NuxtLink>
              </p>
            </CardContent>
          </Card>

          <!-- Footer text -->
          <p class="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our
            <NuxtLink
              to="/terms"
              class="underline hover:text-foreground transition-colors"
              >Terms</NuxtLink
            >
            and
            <NuxtLink
              to="/privacy"
              class="underline hover:text-foreground transition-colors"
              >Privacy Policy</NuxtLink
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.bg-grid-pattern {
  background-image:
    linear-gradient(to right, currentColor 1px, transparent 1px),
    linear-gradient(to bottom, currentColor 1px, transparent 1px);
  background-size: 24px 24px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
