<script setup lang="ts">
import { ref, computed } from "vue";
import { navigateTo } from "#app";
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
import {
  Building2,
  Briefcase,
  Factory,
  GraduationCap,
  ShoppingBag,
  Hotel,
  Package,
  Check,
} from "lucide-vue-next";

const organizationName = ref("");
const subdomain = ref("");
const organizationType = ref("");
const isCheckingSubdomain = ref(false);
const subdomainAvailable = ref<boolean | null>(null);

const organizationTypes = [
  { value: "healthcare", label: "Healthcare", icon: Building2 },
  { value: "corporate", label: "Corporate", icon: Briefcase },
  { value: "manufacturing", label: "Manufacturing", icon: Factory },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "retail", label: "Retail", icon: ShoppingBag },
  { value: "hospitality", label: "Hospitality", icon: Hotel },
  { value: "other", label: "Other", icon: Package },
];

const checkSubdomainAvailability = async () => {
  if (!subdomain.value) return;

  isCheckingSubdomain.value = true;
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));
  subdomainAvailable.value = true;
  isCheckingSubdomain.value = false;
};

const isFormValid = computed(
  () =>
    organizationName.value &&
    subdomain.value &&
    organizationType.value &&
    subdomainAvailable.value,
);

const nextStep = () => {
  if (isFormValid.value) {
    navigateTo("/onboarding/step-2");
  }
};
</script>

<template>
  <div class="min-h-screen bg-muted flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Simplified progress bar at top -->
      <div class="mb-6 flex items-center justify-between text-sm">
        <span class="font-medium text-foreground">Step 1 of 4</span>
        <div class="flex items-center gap-2">
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-muted rounded-full"></div>
          <div class="w-24 h-1.5 bg-muted rounded-full"></div>
          <div class="w-24 h-1.5 bg-muted rounded-full"></div>
        </div>
      </div>

      <!-- More compact card design -->
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">Create Your Organization</CardTitle>
          <CardDescription
            >Set up your workspace in just a few steps</CardDescription
          >
        </CardHeader>

        <CardContent class="space-y-6">
          <div class="space-y-2">
            <Label for="org-name">Organization Name</Label>
            <Input
              id="org-name"
              v-model="organizationName"
              placeholder="Acme Corporation"
            />
          </div>

          <div class="space-y-2">
            <Label for="subdomain">Workspace URL</Label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <Input
                  id="subdomain"
                  v-model="subdomain"
                  placeholder="acme"
                  @blur="checkSubdomainAvailability"
                />
                <div class="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    v-if="isCheckingSubdomain"
                    class="w-4 h-4 text-blue-600 animate-spin"
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
                  <Check
                    v-else-if="subdomainAvailable"
                    class="w-4 h-4 text-green-600"
                  />
                </div>
              </div>
              <span
                class="flex items-center text-sm text-muted-foreground whitespace-nowrap"
                >.workforcepro.com</span
              >
            </div>
          </div>

          <!-- Compact grid for organization types -->
          <div class="space-y-2">
            <Label>Organization Type</Label>
            <div class="grid grid-cols-4 gap-2">
              <Button
                v-for="type in organizationTypes"
                :key="type.value"
                type="button"
                :variant="
                  organizationType === type.value ? 'default' : 'outline'
                "
                @click="organizationType = type.value"
                class="h-auto flex-col gap-2 p-3"
              >
                <component :is="type.icon" class="w-5 h-5" />
                <span class="text-xs">{{ type.label }}</span>
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex justify-between">
            <NuxtLink
             to="/auth/login"
             class="text-sm text-muted-foreground hover:text-foreground"
           >
             Sign in instead
           </NuxtLink>
          <Button @click="nextStep" :disabled="!isFormValid"> Continue </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
