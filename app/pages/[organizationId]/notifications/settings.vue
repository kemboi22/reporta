<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Printer, Edit, Trash2, Eye, Bell } from "lucide-vue-next";
import { definePageMeta } from "#imports";
import { Switch } from "@/components/ui/switch";

definePageMeta({
  layout: "dashboard",
});

const { data: session } = await authClient.useSession();

const showNotifications = ref(false);
const emailSettings = ref({
  taskAssignments: true,
  taskDueReminders: true,
  reportSubmissions: true,
  dailyDigest: false,
  frequency: "realtime",
  urgentOnly: false,
  allNotifications: false,
});

const saveSettings = async () => {
  alert("Settings saved!");
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Notification Settings</h1>
        <p class="text-muted-foreground mt-1">Manage how you receive notifications</p>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
      </CardHeader>
       <CardContent class="space-y-4">
         <div class="flex items-center justify-between">
           <p class="text-sm text-muted-foreground">Task Assignments</p>
           <Switch v-model="emailSettings.taskAssignments" @click="saveSettings" />
         </div>
       </CardContent>
     </Card>

     <Card>
       <CardHeader>
         <CardTitle>Push Notifications</CardTitle>
       </CardHeader>
       <CardContent class="space-y-4">
         <div class="flex items-center justify-between">
           <p class="text-sm text-muted-foreground">Browser notifications</p>
           <Switch v-model="emailSettings.allNotifications" @click="saveSettings" />
         </div>
       </CardContent>
     </Card>

     <Card>
       <CardHeader>
         <CardTitle>In-App Notifications</CardTitle>
       </CardHeader>
       <CardContent class="space-y-4">
         <div class="flex items-center justify-between">
           <p class="text-sm text-muted-foreground">In-App notifications</p>
           <Switch v-model="emailSettings.allNotifications" @click="saveSettings" />
         </div>
       </CardContent>
     </Card>

     <Card>
       <CardHeader>
         <CardTitle>Task Reminders</CardTitle>
       </CardHeader>
       <CardContent class="space-y-4">
         <div class="flex items-center justify-between">
           <p class="text-sm text-muted-foreground">Due date reminders</p>
           <Switch v-model="emailSettings.taskDueReminders" @click="saveSettings" />
         </div>
       </CardContent>
     </Card>

     <Card>
       <CardHeader>
         <CardTitle>Report Submissions</CardTitle>
       </CardHeader>
       <CardContent class="space-y-4">
         <div class="flex items-center justify-between">
           <p class="text-sm text-muted-foreground">Report submissions</p>
           <Switch v-model="emailSettings.reportSubmissions" @click="saveSettings" />
         </div>
       </CardContent>
     </Card>

     <Card>
       <CardHeader>
         <CardTitle>General</CardTitle>
       </CardHeader>
       <CardContent class="space-y-4">
         <div class="flex items-center justify-between">
           <p class="text-sm text-muted-foreground">All Notifications</p>
           <Switch v-model="emailSettings.allNotifications" @click="saveSettings" />
         </div>
       </CardContent>
     </Card>

    <Card>
      <CardHeader>
        <CardTitle>Quiet Hours</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">Quiet hours</p>
          <Switch v-model="emailSettings.allNotifications" @click="saveSettings" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
