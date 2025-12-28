<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta } from "#imports";
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  CheckCircle2,
  Volume2,
  Moon,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

definePageMeta({
  layout: "dashboard",
});

const activeTab = ref("preferences");

const notificationSettings = ref({
  email: {
    newTask: true,
    taskAssigned: true,
    taskCompleted: false,
    commentMention: true,
    deadlineReminder: true,
    weeklyDigest: true,
  },
  push: {
    newTask: true,
    taskAssigned: true,
    taskCompleted: true,
    commentMention: true,
    deadlineReminder: true,
    dailySummary: false,
  },
  sms: {
    urgentOnly: true,
    deadlineReminder: false,
    shiftReminder: true,
  },
  doNotDisturb: {
    enabled: false,
    startTime: "22:00",
    endTime: "08:00",
  },
});

const notificationMethods = [
  { id: "email", name: "Email", icon: Mail, description: "Receive notifications via email" },
  { id: "push", name: "Push Notifications", icon: Smartphone, description: "Get instant alerts on your device" },
  { id: "sms", name: "SMS", icon: MessageSquare, description: "Text messages for urgent updates" },
];
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Notifications</h1>
        <p class="text-muted-foreground mt-1">Manage how you receive alerts</p>
      </div>
      <Button variant="outline" class="gap-2">
        <Bell class="h-4 w-4" />
        Test Notification
      </Button>
    </div>

    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full md:w-auto md:inline-grid grid-cols-3 bg-muted/50">
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="channels">Channels</TabsTrigger>
        <TabsTrigger value="dnd">Do Not Disturb</TabsTrigger>
      </TabsList>

      <TabsContent value="preferences" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Task Notifications</CardTitle>
            <CardDescription>Configure alerts for task activities</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">New Task Created</h4>
                <p class="text-sm text-muted-foreground">Get notified when tasks are created</p>
              </div>
              <Switch v-model:checked="notificationSettings.email.newTask" />
            </div>
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Task Assigned to You</h4>
                <p class="text-sm text-muted-foreground">Alert when tasks are assigned</p>
              </div>
              <Switch v-model:checked="notificationSettings.push.taskAssigned" :default-checked="true" />
            </div>
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Task Completed</h4>
                <p class="text-sm text-muted-foreground">Notify when assigned tasks are done</p>
              </div>
              <Switch v-model:checked="notificationSettings.push.taskCompleted" />
            </div>
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Comment Mentions</h4>
                <p class="text-sm text-muted-foreground">Alert when mentioned in comments</p>
              </div>
              <Switch v-model:checked="notificationSettings.email.commentMention" :default-checked="true" />
            </div>
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Deadline Reminders</h4>
                <p class="text-sm text-muted-foreground">Get reminders before deadlines</p>
              </div>
              <Switch v-model:checked="notificationSettings.email.deadlineReminder" :default-checked="true" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary Notifications</CardTitle>
            <CardDescription>Configure periodic summaries</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Weekly Digest</h4>
                <p class="text-sm text-muted-foreground">Receive a summary of all activity</p>
              </div>
              <Switch v-model:checked="notificationSettings.email.weeklyDigest" :default-checked="true" />
            </div>
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Daily Summary</h4>
                <p class="text-sm text-muted-foreground">Get daily recap of tasks and updates</p>
              </div>
              <Switch v-model:checked="notificationSettings.push.dailySummary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sound Settings</CardTitle>
            <CardDescription>Configure notification sounds</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Sound Effects</h4>
                <p class="text-sm text-muted-foreground">Play sounds for notifications</p>
              </div>
              <Switch :default-checked="true" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="channels" class="space-y-4">
        <div class="grid md:grid-cols-3 gap-4">
          <Card v-for="method in notificationMethods" :key="method.id" class="hover:shadow-md transition-all">
            <CardContent class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <component :is="method.icon" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-foreground">{{ method.name }}</h3>
                  <p class="text-xs text-muted-foreground mt-1">{{ method.description }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <CheckCircle2 class="h-4 w-4 text-emerald-500" />
                <span class="text-sm text-foreground">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email Preferences</CardTitle>
            <CardDescription>Configure email notification settings</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="email-frequency">Email Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Marketing Emails</h4>
                <p class="text-sm text-muted-foreground">Receive product updates and offers</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dnd" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Do Not Disturb</CardTitle>
            <CardDescription>Silence notifications during specific hours</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div class="flex items-center gap-3">
                <div class="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                  <Moon class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 class="font-medium text-foreground">Enable Do Not Disturb</h4>
                  <p class="text-sm text-muted-foreground">Pause all notifications</p>
                </div>
              </div>
              <Switch v-model:checked="notificationSettings.doNotDisturb.enabled" />
            </div>

            <div v-if="notificationSettings.doNotDisturb.enabled" class="space-y-4">
              <div class="grid md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="dnd-start">Start Time</Label>
                  <div class="flex items-center gap-2">
                    <Moon class="h-4 w-4 text-muted-foreground" />
                    <input id="dnd-start" type="time" v-model="notificationSettings.doNotDisturb.startTime" class="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div class="space-y-2">
                  <Label for="dnd-end">End Time</Label>
                  <div class="flex items-center gap-2">
                    <Volume2 class="h-4 w-4 text-muted-foreground" />
                    <input id="dnd-end" type="time" v-model="notificationSettings.doNotDisturb.endTime" class="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
              </div>

              <div class="p-4 rounded-lg bg-muted/30">
                <p class="text-sm text-muted-foreground">
                  <strong>Current Schedule:</strong> Notifications will be silenced between
                  <span class="font-medium text-foreground">{{ notificationSettings.doNotDisturb.startTime }}</span> and
                  <span class="font-medium text-foreground">{{ notificationSettings.doNotDisturb.endTime }}</span>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Override</CardTitle>
            <CardDescription>Allow certain notifications through DND</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Urgent Tasks</h4>
                <p class="text-sm text-muted-foreground">Always notify for urgent items</p>
              </div>
              <Switch :default-checked="true" />
            </div>
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">Direct Mentions</h4>
                <p class="text-sm text-muted-foreground">Allow @mentions to bypass DND</p>
              </div>
              <Switch :default-checked="true" />
            </div>
            <div class="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 class="font-medium text-foreground">System Alerts</h4>
                <p class="text-sm text-muted-foreground">Critical system notifications</p>
              </div>
              <Switch :default-checked="true" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
