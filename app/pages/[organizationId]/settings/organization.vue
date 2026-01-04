<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta } from "#imports";
import {
  Building2,
  Upload,
  Globe,
  Clock,
  Calendar as CalendarIcon,
  Palette,
  Save,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { isAdmin } from "~/utils";
import { navigateTo } from "#imports";

definePageMeta({
  layout: "dashboard",
});

if (!isAdmin()) {
  navigateTo(`/${organizationId}/dashboard`);
}

const activeTab = ref("general");
const hasChanges = ref(false);

const orgSettings = ref({
  name: "Acme Corporation",
  subdomain: "acme",
  logo: null,
  type: "healthcare",
  timezone: "UTC",
  currency: "USD",
  workingHoursStart: "09:00",
  workingHoursEnd: "17:00",
  weekendDays: ["saturday", "sunday"],
  primaryColor: "#3b82f6",
});

const organizationTypes = [
  { value: "healthcare", label: "Healthcare", icon: "🏥" },
  { value: "corporate", label: "Corporate", icon: "🏢" },
  { value: "manufacturing", label: "Manufacturing", icon: "🏭" },
  { value: "education", label: "Education", icon: "🎓" },
  { value: "retail", label: "Retail", icon: "🏪" },
  { value: "hospitality", label: "Hospitality", icon: "🏨" },
  { value: "other", label: "Other", icon: "🏢" },
];

const timezones = [
  "UTC", "America/New_York", "America/Los_Angeles", "America/Chicago",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Dubai",
  "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney",
];

const currencies = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "AED", label: "AED (د.إ)", symbol: "د.إ" },
  { value: "SGD", label: "SGD ($)", symbol: "$" },
  { value: "AUD", label: "AUD ($)", symbol: "$" },
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

const colorOptions = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1",
];

const toggleWeekend = (day: string) => {
  const index = orgSettings.value.weekendDays.indexOf(day);
  if (index > -1) {
    orgSettings.value.weekendDays.splice(index, 1);
  } else {
    orgSettings.value.weekendDays.push(day);
  }
  hasChanges.value = true;
};

const saveSettings = () => {
  hasChanges.value = false;
};

const getInitials = (name: string) => {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Organization Settings</h1>
        <p class="text-muted-foreground mt-1">Configure your workspace and branding</p>
      </div>
      <Button @click="saveSettings" :disabled="!hasChanges" class="gap-2">
        <Save class="h-4 w-4" />
        Save Changes
      </Button>
    </div>

    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full md:w-auto md:inline-grid grid-cols-4 bg-muted/50">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
        <TabsTrigger value="working">Working Hours</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="general" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>Basic information about your organization</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="org-name">Organization Name</Label>
              <Input id="org-name" v-model="orgSettings.name" @input="hasChanges = true" />
            </div>
            <div class="space-y-2">
              <Label for="org-type">Organization Type</Label>
              <Select v-model="orgSettings.type" @update:model-value="hasChanges = true">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="type in organizationTypes" :key="type.value" :value="type.value">
                    <span class="mr-2">{{ type.icon }}</span>
                    {{ type.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="subdomain">Workspace URL</Label>
              <div class="flex items-center gap-2">
                <Input id="subdomain" v-model="orgSettings.subdomain" @input="hasChanges = true" />
                <span class="text-sm text-muted-foreground whitespace-nowrap">.workforcepro.com</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div class="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Timezone</CardTitle>
              <CardDescription>Set your organization's timezone</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex items-center gap-2 mb-3">
                <Globe class="h-4 w-4 text-muted-foreground" />
                <Select v-model="orgSettings.timezone" @update:model-value="hasChanges = true" class="flex-1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p class="text-xs text-muted-foreground mt-2">Current time: {{ new Date().toLocaleTimeString() }}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Currency</CardTitle>
              <CardDescription>Default currency for payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Select v-model="orgSettings.currency" @update:model-value="hasChanges = true">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="curr in currencies" :key="curr.value" :value="curr.value">{{ curr.label }}</SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground mt-2">Used in reports and billing</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="branding" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Logo & Identity</CardTitle>
            <CardDescription>Customize your organization's appearance</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="flex items-start gap-6">
              <Avatar class="h-20 w-20 border-2 border-border">
                <AvatarFallback class="bg-primary text-primary-foreground text-2xl">
                  {{ getInitials(orgSettings.name) }}
                </AvatarFallback>
              </Avatar>
              <div class="flex-1 space-y-2">
                <Button variant="outline" class="gap-2">
                  <Upload class="h-4 w-4" />
                  Upload Logo
                </Button>
                <p class="text-xs text-muted-foreground">PNG, JPG, or SVG up to 2MB. Recommended size: 200x200px.</p>
              </div>
            </div>
            <Separator />
            <div class="space-y-3">
              <Label>Primary Color</Label>
              <div class="flex items-center gap-3">
                <div
                  v-for="color in colorOptions"
                  :key="color"
                  :class="['w-10 h-10 rounded-lg cursor-pointer border-2 transition-all', orgSettings.primaryColor === color ? 'border-primary scale-110' : 'border-transparent hover:scale-105']"
                  :style="{ backgroundColor: color }"
                  @click="orgSettings.primaryColor = color; hasChanges = true"
                ></div>
              </div>
            </div>
            <div class="space-y-2">
              <Label for="custom-color">Custom Color</Label>
              <div class="flex items-center gap-2">
                <Input id="custom-color" type="color" v-model="orgSettings.primaryColor" @input="hasChanges = true" class="w-16 h-10" />
                <Input :value="orgSettings.primaryColor" readonly class="flex-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="rounded-lg border p-4" :style="{ borderColor: orgSettings.primaryColor }">
              <div class="flex items-center gap-3 mb-4">
                <Avatar class="h-10 w-10" :style="{ backgroundColor: orgSettings.primaryColor }">
                  <AvatarFallback class="text-white text-sm">{{ getInitials(orgSettings.name) }}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 class="font-semibold">{{ orgSettings.name }}</h4>
                  <p class="text-xs text-muted-foreground">{{ orgSettings.type }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <Button size="sm" :style="{ backgroundColor: orgSettings.primaryColor }">Primary Button</Button>
                <Button size="sm" variant="outline">Secondary Button</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="working" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
            <CardDescription>Set standard operating hours for your organization</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="start-time">Start Time</Label>
                <div class="flex items-center gap-2">
                  <Clock class="h-4 w-4 text-muted-foreground" />
                  <Input id="start-time" type="time" v-model="orgSettings.workingHoursStart" @input="hasChanges = true" />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="end-time">End Time</Label>
                <div class="flex items-center gap-2">
                  <Clock class="h-4 w-4 text-muted-foreground" />
                  <Input id="end-time" type="time" v-model="orgSettings.workingHoursEnd" @input="hasChanges = true" />
                </div>
              </div>
            </div>
            <p class="text-xs text-muted-foreground">These hours are used for scheduling and availability calculations.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekend Days</CardTitle>
            <CardDescription>Configure non-working days</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              <Button
                v-for="day in weekDays"
                :key="day.value"
                variant="outline"
                size="sm"
                @click="toggleWeekend(day.value)"
                :class="[
                  'transition-all',
                  orgSettings.weekendDays.includes(day.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted',
                ]"
              >
                {{ day.label }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Calendar Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-7 gap-1 text-center text-xs">
              <div v-for="day in weekDays" :key="day.value" class="p-2 text-muted-foreground">{{ day.label }}</div>
            </div>
            <div class="grid grid-cols-7 gap-1 mt-1">
              <div
                v-for="i in 28"
                :key="i"
                :class="[
                  'p-2 text-sm rounded text-center',
                  orgSettings.weekendDays.includes(['sunday', 'saturday'][i % 7])
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-background hover:bg-muted'
                ]"
              >
                {{ i }}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="advanced" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Organization Features</CardTitle>
            <CardDescription>Enable or disable additional features</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Auto-assign Tasks</h4>
                <p class="text-sm text-muted-foreground">Automatically assign tasks to available staff</p>
              </div>
              <Switch @update:checked="hasChanges = true" />
            </div>
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Overtime Tracking</h4>
                <p class="text-sm text-muted-foreground">Monitor and alert on overtime hours</p>
              </div>
              <Switch @update:checked="hasChanges = true" :default-checked="true" />
            </div>
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Public Portal</h4>
                <p class="text-sm text-muted-foreground">Allow external access to public schedules</p>
              </div>
              <Switch @update:checked="hasChanges = true" />
            </div>
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Audit Logging</h4>
                <p class="text-sm text-muted-foreground">Keep detailed logs of all activities</p>
              </div>
              <Switch @update:checked="hasChanges = true" :default-checked="true" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your organization</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
              <h4 class="font-medium text-destructive mb-2">Delete Organization</h4>
              <p class="text-sm text-muted-foreground mb-3">This will permanently delete all data including users, tasks, projects, and settings. This action cannot be undone.</p>
              <Button variant="destructive" size="sm">Delete Organization</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
