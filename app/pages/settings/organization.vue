<script setup lang="ts">
import { ref } from "vue";

const orgName = ref("Acme Corporation");
const subdomain = ref("acme");
const orgType = ref("corporate");
const timezone = ref("UTC");
const currency = ref("USD");
const workingHoursStart = ref("09:00");
const workingHoursEnd = ref("17:00");
const weekendDays = ref(["saturday", "sunday"]);

const organizationTypes = [
  { value: "healthcare", label: "Healthcare" },
  { value: "corporate", label: "Corporate" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "hospitality", label: "Hospitality" },
  { value: "other", label: "Other" },
];

const timezones = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
];

const currencies = ["USD", "EUR", "GBP", "AED", "SGD", "AUD"];

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

const saveSettings = () => {
  console.log("[v0] Saving organization settings");
  // API call here
};
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="p-6">
      <div class="max-w-4xl">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-slate-900 mb-2">
            Organization Settings
          </h1>
          <p class="text-slate-600">
            Manage your workspace configuration and branding
          </p>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <!-- Logo Upload -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Organization Logo
            </label>
            <div class="flex items-center gap-4">
              <div
                class="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center border-2 border-slate-200"
              >
                <span class="text-2xl font-bold text-slate-400">AC</span>
              </div>
              <div>
                <button
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Upload Logo
                </button>
                <p class="text-xs text-slate-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>

          <!-- Organization Name -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Organization Name
            </label>
            <input
              v-model="orgName"
              type="text"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Subdomain -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Workspace URL
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model="subdomain"
                type="text"
                class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-slate-500 whitespace-nowrap"
                >.workforcepro.com</span
              >
            </div>
          </div>

          <!-- Organization Type -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Organization Type
            </label>
            <select
              v-model="orgType"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option
                v-for="type in organizationTypes"
                :key="type.value"
                :value="type.value"
              >
                {{ type.label }}
              </option>
            </select>
          </div>

          <!-- Timezone and Currency -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Timezone
              </label>
              <select
                v-model="timezone"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="tz in timezones" :key="tz" :value="tz">
                  {{ tz }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Currency
              </label>
              <select
                v-model="currency"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="cur in currencies" :key="cur" :value="cur">
                  {{ cur }}
                </option>
              </select>
            </div>
          </div>

          <!-- Working Hours -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Working Hours
            </label>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <input
                  v-model="workingHoursStart"
                  type="time"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p class="text-xs text-slate-500 mt-1">Start time</p>
              </div>
              <div>
                <input
                  v-model="workingHoursEnd"
                  type="time"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p class="text-xs text-slate-500 mt-1">End time</p>
              </div>
            </div>
          </div>

          <!-- Weekend Days -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Weekend Days
            </label>
            <div class="flex gap-2">
              <button
                v-for="day in weekDays"
                :key="day.value"
                type="button"
                @click="toggleWeekend(day.value)"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors text-sm',
                  weekendDays.includes(day.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                ]"
              >
                {{ day.label }}
              </button>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end pt-4 border-t border-slate-200">
            <button
              @click="saveSettings"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
