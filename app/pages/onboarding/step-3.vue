<script setup lang="ts">
import { ref } from "vue";
import { navigateTo } from "#app"; // Import navigateTo from '#app'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-vue-next";

const timezone = ref("UTC");
const workingHoursStart = ref("09:00");
const workingHoursEnd = ref("17:00");
const weekendDays = ref(["saturday", "sunday"]);
const currency = ref("USD");
const logoFile = ref<File | null>(null);
const logoPreview = ref<string | null>(null);

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European Time" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

const currencies = [
  { value: "USD", label: "USD - US Dollar ($)" },
  { value: "EUR", label: "EUR - Euro (€)" },
  { value: "GBP", label: "GBP - British Pound (£)" },
  { value: "AED", label: "AED - UAE Dirham (د.إ)" },
  { value: "SGD", label: "SGD - Singapore Dollar (S$)" },
  { value: "AUD", label: "AUD - Australian Dollar (A$)" },
];

const weekDays = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

const toggleWeekend = (day: string) => {
  const index = weekendDays.value.indexOf(day);
  if (index > -1) {
    weekendDays.value.splice(index, 1);
  } else {
    weekendDays.value.push(day);
  }
};

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    logoFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const nextStep = () => {
  navigateTo("/onboarding/step-4");
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Compact progress bar -->
      <div class="mb-6 flex items-center justify-between text-sm">
        <span class="font-medium text-slate-900">Step 3 of 4</span>
        <div class="flex items-center gap-2">
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-slate-200 rounded-full"></div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">Workspace Configuration</CardTitle>
          <CardDescription
            >Set timezone, hours, and preferences</CardDescription
          >
        </CardHeader>

        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="timezone">Timezone</Label>
              <Select v-model="timezone">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="tz in timezones"
                    :key="tz.value"
                    :value="tz.value"
                  >
                    {{ tz.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="currency">Currency</Label>
              <Select v-model="currency">
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="cur in currencies"
                    :key="cur.value"
                    :value="cur.value"
                  >
                    {{ cur.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-2">
            <Label>Working Hours</Label>
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="workingHoursStart" type="time" />
              <Input v-model="workingHoursEnd" type="time" />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Weekend Days</Label>
            <div class="flex flex-wrap gap-2">
              <Button
                v-for="day in weekDays"
                :key="day.value"
                type="button"
                size="sm"
                @click="toggleWeekend(day.value)"
                :variant="
                  weekendDays.includes(day.value) ? 'default' : 'outline'
                "
              >
                {{ day.label }}
              </Button>
            </div>
          </div>

          <div class="space-y-2">
            <Label>Logo (Optional)</Label>
            <label class="cursor-pointer">
              <div
                class="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition-colors"
              >
                <Upload class="w-6 h-6 mx-auto text-slate-400 mb-1" />
                <p class="text-sm text-slate-600">Upload your logo</p>
              </div>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleLogoUpload"
              />
            </label>
            <div v-if="logoPreview" class="mt-2">
              <img
                :src="logoPreview"
                alt="Logo"
                class="w-16 h-16 rounded object-cover"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex justify-between">
          <Button variant="ghost" @click="navigateTo('/onboarding/step-2')">
            Back
          </Button>
          <Button @click="nextStep">Continue</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
