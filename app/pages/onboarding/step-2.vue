<script setup lang="ts">
import { ref, computed } from "vue";
import { navigateTo } from "#app"; // Import navigateTo from Nuxt.js
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-vue-next";

const adminFirstName = ref("");
const adminLastName = ref("");
const adminEmail = ref("");
const adminPassword = ref("");
const showPassword = ref(false);

const passwordStrength = computed(() => {
  const password = adminPassword.value;
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score <= 4) return { score, label: "Good", color: "bg-blue-500" };
  return { score, label: "Strong", color: "bg-green-500" };
});

const isFormValid = computed(
  () =>
    adminFirstName.value &&
    adminLastName.value &&
    adminEmail.value &&
    adminPassword.value &&
    passwordStrength.value.score >= 3,
);

const nextStep = () => {
  if (isFormValid.value) {
    navigateTo("/onboarding/step-3");
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Compact progress bar -->
      <div class="mb-6 flex items-center justify-between text-sm">
        <span class="font-medium text-slate-900">Step 2 of 4</span>
        <div class="flex items-center gap-2">
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-slate-200 rounded-full"></div>
          <div class="w-24 h-1.5 bg-slate-200 rounded-full"></div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">Create Admin Account</CardTitle>
          <CardDescription
            >Set up your administrator credentials</CardDescription
          >
        </CardHeader>

        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="first-name">First Name</Label>
              <Input
                id="first-name"
                v-model="adminFirstName"
                placeholder="John"
              />
            </div>
            <div class="space-y-2">
              <Label for="last-name">Last Name</Label>
              <Input id="last-name" v-model="adminLastName" placeholder="Doe" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="email">Email Address</Label>
            <Input
              id="email"
              v-model="adminEmail"
              type="email"
              placeholder="john@acme.com"
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <div class="relative">
              <Input
                id="password"
                v-model="adminPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Create a strong password"
                class="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                @click="showPassword = !showPassword"
                class="absolute right-0 top-0 h-full px-3"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </Button>
            </div>

            <div v-if="adminPassword" class="space-y-2">
              <div class="flex items-center gap-2">
                <div
                  class="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden"
                >
                  <div
                    :class="[passwordStrength.color, 'h-full transition-all']"
                    :style="{ width: `${(passwordStrength.score / 5) * 100}%` }"
                  ></div>
                </div>
                <span class="text-xs font-medium">{{
                  passwordStrength.label
                }}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex justify-between">
          <Button variant="ghost" @click="navigateTo('/onboarding/step-1')">
            Back
          </Button>
          <Button @click="nextStep" :disabled="!isFormValid"> Continue </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
