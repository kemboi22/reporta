<script setup lang="ts">
import { X, Plus, Users, Rocket } from "lucide-vue-next";
const { organizationForm } = useOrganizationStore();
const isLoading = ref(false);
const error = ref<string | null>(null);

const addEmailField = () => {
  organizationForm.inviteEmails.push("");
};

const removeEmailField = (index: number) => {
  organizationForm.inviteEmails.splice(index, 1);
};

const completeOnboarding = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const result = await $fetch("/api/onboarding/complete", {
      method: "POST",
      body: {
        organizationName: organizationForm.name,
        subdomain: organizationForm.name
          ?.toLowerCase()
          .replace(/[^a-z0-9-]/g, "-"),
        organizationType: organizationForm.industry,
        settings: organizationForm.settings,
        invitations: organizationForm.inviteEmails.filter(
          (email) => email.trim() !== "",
        ),
      },
    });

    if (result) {
      await navigateTo(`/${result.organization.id}/dashboard`);
    }
  } catch (e: any) {
    error.value = e.data?.message || "Failed to complete onboarding";
  } finally {
    isLoading.value = false;
  }
};

const skipAndComplete = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const result = await $fetch("/api/onboarding/complete", {
      method: "POST",
      body: {
        organizationName: organizationForm.name,
        subdomain: organizationForm.name
          ?.toLowerCase()
          .replace(/[^a-z0-9-]/g, "-"),
        organizationType: organizationForm.industry,
        settings: organizationForm.settings,
        invitations: [],
      },
    });

    if (result) {
      await navigateTo("/dashboard");
    }
  } catch (e: any) {
    error.value = e.data?.message || "Failed to complete onboarding";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-muted flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Compact progress bar -->
      <div class="mb-6 flex items-center justify-between text-sm">
        <span class="font-medium text-foreground">Step 3 of 3</span>
        <div class="flex items-center gap-2">
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-muted rounded-full"></div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">Invite Your Team</CardTitle>
          <CardDescription>Add team members or skip for now</CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <div
            v-for="(email, index) in organizationForm.inviteEmails"
            :key="index"
            class="flex gap-2"
          >
            <Input
              v-model="organizationForm.inviteEmails[index]"
              type="email"
              placeholder="colleague@acme.com"
              class="flex-1"
            />
            <Button
              v-if="organizationForm.inviteEmails.length > 1"
              variant="ghost"
              size="icon"
              @click="removeEmailField(index)"
            >
              <X class="w-4 h-4" />
            </Button>
          </div>

          <Button
            @click="addEmailField"
            variant="outline"
            class="w-full"
            size="sm"
          >
            <Plus class="w-4 h-4 mr-2" />
            Add Another Email
          </Button>

          <div
            v-if="error"
            class="p-3 bg-destructive/10 text-destructive rounded-md text-sm"
          >
            {{ error }}
          </div>
        </CardContent>

        <CardFooter class="flex justify-between">
          <Button
            variant="ghost"
            @click="navigateTo('/onboarding/step-2')"
            :disabled="isLoading"
          >
            Back
          </Button>
          <div class="flex gap-2">
            <Button
              variant="outline"
              @click="skipAndComplete"
              :disabled="isLoading"
            >
              Skip
            </Button>
            <Button @click="completeOnboarding" :disabled="isLoading">
              <span v-if="isLoading">Creating...</span>
              <span v-else>Complete Setup</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
