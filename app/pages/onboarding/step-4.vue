<script setup lang="ts">
import { ref } from "vue";
import { navigateTo } from "#app"; // Declare the navigateTo variable
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
import { X, Plus, Users, Rocket } from "lucide-vue-next";

const inviteEmails = ref([""]);
const isLoading = ref(false);

const addEmailField = () => {
  inviteEmails.value.push("");
};

const removeEmailField = (index: number) => {
  inviteEmails.value.splice(index, 1);
};

const completeOnboarding = async () => {
  isLoading.value = true;
  // Simulate workspace creation
  await new Promise((resolve) => setTimeout(resolve, 1500));
  navigateTo("/dashboard");
};

const skipAndComplete = async () => {
  isLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  navigateTo("/dashboard");
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Compact progress bar -->
      <div class="mb-6 flex items-center justify-between text-sm">
        <span class="font-medium text-slate-900">Step 4 of 4</span>
        <div class="flex items-center gap-2">
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">Invite Your Team</CardTitle>
          <CardDescription>Add team members or skip for now</CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <div
            v-for="(email, index) in inviteEmails"
            :key="index"
            class="flex gap-2"
          >
            <Input
              v-model="inviteEmails[index]"
              type="email"
              placeholder="colleague@acme.com"
              class="flex-1"
            />
            <Button
              v-if="inviteEmails.length > 1"
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
        </CardContent>

        <CardFooter class="flex justify-between">
          <Button
            variant="ghost"
            @click="navigateTo('/onboarding/step-3')"
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
