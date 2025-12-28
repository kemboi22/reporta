<script setup lang="ts">
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
const { organizationForm } = useOrganizationStore();

const organizationTypes = [
  { value: "healthcare", label: "Healthcare", icon: Building2 },
  { value: "corporate", label: "Corporate", icon: Briefcase },
  { value: "manufacturing", label: "Manufacturing", icon: Factory },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "retail", label: "Retail", icon: ShoppingBag },
  { value: "hospitality", label: "Hospitality", icon: Hotel },
  { value: "other", label: "Other", icon: Package },
];

const isFormValid = computed(
  () => organizationForm.name && organizationForm.industry,
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
        <span class="font-medium text-foreground">Step 1 of 3</span>
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
              v-model="organizationForm.name"
              placeholder="Acme Corporation"
            />
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
                  organizationForm.industry === type.value
                    ? 'default'
                    : 'outline'
                "
                @click="organizationForm.industry = type.value"
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
