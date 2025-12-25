<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Smartphone, Monitor, Moon, Save } from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const emailSettings = ref({
  taskAssignments: true,
  taskDueReminders: true,
  reportSubmissions: true,
  dailyDigest: false,
  urgentOnly: true,
  frequency: "realtime",
});

const inAppSettings = ref({
  allActivities: true,
  mentions: true,
  taskUpdates: true,
  reportReminders: true,
});

const smsSettings = ref({
  urgentTasks: true,
  criticalAlerts: true,
  allNotifications: false,
});

const pushSettings = ref({
  enabled: true,
});

const quietHours = ref({
  enabled: true,
  start: "22:00",
  end: "06:00",
  exceptUrgent: true,
});

const testNotification = () => {
  // Trigger test notification
  alert("Test notification sent!");
};

const saveSettings = () => {
  // Save settings
  alert("Settings saved successfully!");
};
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Notification Settings</h1>
        <p class="text-slate-600 mt-1">Manage how you receive notifications</p>
      </div>
      <Button @click="saveSettings">
        <Save class="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Email Notifications -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <Mail class="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription
                >Configure email notification preferences</CardDescription
              >
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Task Assignments</Label>
              <p class="text-sm text-slate-600">
                Receive emails when tasks are assigned to you
              </p>
            </div>
            <Switch v-model:checked="emailSettings.taskAssignments" />
          </div>

          <Separator />

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Task Due Reminders</Label>
              <p class="text-sm text-slate-600">
                1 day before and 1 hour before due date
              </p>
            </div>
            <Switch v-model:checked="emailSettings.taskDueReminders" />
          </div>

          <Separator />

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Report Submissions</Label>
              <p class="text-sm text-slate-600">
                Notifications about report status changes
              </p>
            </div>
            <Switch v-model:checked="emailSettings.reportSubmissions" />
          </div>

          <Separator />

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Daily Digest</Label>
              <p class="text-sm text-slate-600">Summary of daily activity</p>
            </div>
            <Switch v-model:checked="emailSettings.dailyDigest" />
          </div>

          <Separator />

          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label>Urgent Alerts Only</Label>
              <p class="text-sm text-slate-600">
                Only receive critical notifications
              </p>
            </div>
            <Switch v-model:checked="emailSettings.urgentOnly" />
          </div>

          <Separator />

          <div class="space-y-3">
            <Label>Email Frequency</Label>
            <Select v-model="emailSettings.frequency">
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <!-- In-App Notifications -->
      <Card>
        <CardHeader>
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <Bell class="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>In-App</CardTitle>
              <CardDescription>Browser notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <Label class="text-sm">All Activities</Label>
            <Switch v-model:checked="inAppSettings.allActivities" />
          </div>

          <Separator />

          <div class="flex items-center justify-between">
            <Label class="text-sm">@Mentions</Label>
            <Switch v-model:checked="inAppSettings.mentions" />
          </div>

          <Separator />

          <div class="flex items-center justify-between">
            <Label class="text-sm">Task Updates</Label>
            <Switch v-model:checked="inAppSettings.taskUpdates" />
          </div>

          <Separator />

          <div class="flex items-center justify-between">
            <Label class="text-sm">Report Reminders</Label>
            <Switch v-model:checked="inAppSettings.reportReminders" />
          </div>
        </CardContent>
      </Card>

      <!-- SMS Notifications -->
      <Card>
        <CardHeader>
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <Smartphone class="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle>SMS</CardTitle>
              <CardDescription>Text message alerts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <Label class="text-sm">Urgent Tasks</Label>
            <Switch v-model:checked="smsSettings.urgentTasks" />
          </div>

          <Separator />

          <div class="flex items-center justify-between">
            <Label class="text-sm">Critical Alerts</Label>
            <Switch v-model:checked="smsSettings.criticalAlerts" />
          </div>

          <Separator />

          <div class="flex items-center justify-between">
            <Label class="text-sm">All Notifications</Label>
            <Switch v-model:checked="smsSettings.allNotifications" />
          </div>
        </CardContent>
      </Card>

      <!-- Desktop Push -->
      <Card>
        <CardHeader>
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
            >
              <Monitor class="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle>Desktop Push</CardTitle>
              <CardDescription>Browser notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <Label>Enable Desktop Notifications</Label>
            <Switch v-model:checked="pushSettings.enabled" />
          </div>

          <Button
            variant="outline"
            class="w-full"
            @click="testNotification"
            :disabled="!pushSettings.enabled"
          >
            Test Notification
          </Button>
        </CardContent>
      </Card>

      <!-- Quiet Hours -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
            >
              <Moon class="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle>Quiet Hours</CardTitle>
              <CardDescription>Set do not disturb times</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="flex items-center justify-between">
            <Label>Enable Quiet Hours</Label>
            <Switch v-model:checked="quietHours.enabled" />
          </div>

          <div v-if="quietHours.enabled" class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Start Time</Label>
              <Input v-model="quietHours.start" type="time" />
            </div>
            <div class="space-y-2">
              <Label>End Time</Label>
              <Input v-model="quietHours.end" type="time" />
            </div>
          </div>

          <div
            v-if="quietHours.enabled"
            class="flex items-center justify-between"
          >
            <div class="space-y-0.5">
              <Label>Except Urgent Alerts</Label>
              <p class="text-sm text-slate-600">
                Allow critical notifications during quiet hours
              </p>
            </div>
            <Switch v-model:checked="quietHours.exceptUrgent" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
