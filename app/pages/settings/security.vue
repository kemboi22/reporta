<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta } from "#imports";
import {
  Shield,
  Key,
  Smartphone,
  Monitor,
  Globe,
  History,
  CheckCircle2,
  XCircle,
  MoreVertical,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

definePageMeta({
  layout: "dashboard",
});

const showPasswordDialog = ref(false);
const show2FADialog = ref(false);
const showSessionDialog = ref(false);
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);

const securitySettings = ref([
  { id: 1, name: "Two-Factor Authentication", enabled: true, description: "Add an extra layer of security" },
  { id: 2, name: "Login Notifications", enabled: true, description: "Get notified of new sign-ins" },
  { id: 3, name: "IP Whitelist", enabled: false, description: "Restrict access to specific IPs" },
  { id: 4, name: "Session Timeout", enabled: true, description: "Auto logout after inactivity" },
]);

const activeSessions = ref([
  { id: 1, device: "MacBook Pro", location: "San Francisco, US", ip: "192.168.1.1", current: true, lastActive: "Now" },
  { id: 2, device: "iPhone 15", location: "San Francisco, US", ip: "192.168.1.2", current: false, lastActive: "2 hours ago" },
  { id: 3, device: "Chrome on Windows", location: "New York, US", ip: "10.0.0.1", current: false, lastActive: "1 day ago" },
]);

const loginHistory = ref([
  { id: 1, date: "Dec 26, 2024", time: "10:30 AM", device: "MacBook Pro", location: "San Francisco, US", status: "success" },
  { id: 2, date: "Dec 25, 2024", time: "3:45 PM", device: "iPhone 15", location: "San Francisco, US", status: "success" },
  { id: 3, date: "Dec 24, 2024", time: "9:15 AM", device: "Unknown", location: "London, UK", status: "failed" },
  { id: 4, date: "Dec 23, 2024", time: "8:00 AM", device: "Chrome on Windows", location: "New York, US", status: "success" },
]);

const revokeSession = (id: number) => {
  const index = activeSessions.value.findIndex((s) => s.id === id && !s.current);
  if (index > -1) {
    activeSessions.value.splice(index, 1);
  }
};

const updatePassword = () => {
  showPasswordDialog.value = false;
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Security</h1>
      <p class="text-muted-foreground mt-1">Manage account security and access control</p>
    </div>

    <Tabs default-value="overview" class="w-full">
      <TabsList class="grid w-full md:w-auto md:inline-grid grid-cols-4 bg-muted/50">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="history">Login History</TabsTrigger>
        <TabsTrigger value="audit">Audit Log</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure your account security preferences</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-for="setting in securitySettings" :key="setting.id" class="flex items-center justify-between p-4 rounded-lg border">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Shield class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 class="font-medium text-foreground">{{ setting.name }}</h4>
                  <p class="text-sm text-muted-foreground">{{ setting.description }}</p>
                </div>
              </div>
              <Switch :id="'setting-' + setting.id" v-model:checked="setting.enabled" />
            </div>
          </CardContent>
        </Card>

        <div class="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Change Password</CardTitle>
              <CardDescription>Update your account password regularly</CardDescription>
            </CardHeader>
            <CardContent>
              <Button class="w-full" @click="showPasswordDialog = true">
                <Key class="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Two-Factor Auth</CardTitle>
              <CardDescription>Add extra security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" class="w-full" @click="show2FADialog = true">
                <Smartphone class="h-4 w-4 mr-2" />
                Configure 2FA
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Password Requirements</CardTitle>
            <CardDescription>Your password must meet these criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid md:grid-cols-2 gap-3">
              <div class="flex items-center gap-2 text-sm">
                <CheckCircle2 class="h-4 w-4 text-emerald-500" />
                <span class="text-foreground">Minimum 8 characters</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <CheckCircle2 class="h-4 w-4 text-emerald-500" />
                <span class="text-foreground">At least one uppercase</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <CheckCircle2 class="h-4 w-4 text-emerald-500" />
                <span class="text-foreground">At least one lowercase</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <CheckCircle2 class="h-4 w-4 text-emerald-500" />
                <span class="text-foreground">At least one number</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <CheckCircle2 class="h-4 w-4 text-emerald-500" />
                <span class="text-foreground">At least one special character</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <XCircle class="h-4 w-4 text-destructive" />
                <span class="text-muted-foreground">Cannot reuse last 5 passwords</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sessions" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>Manage where you're logged in</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div v-for="session in activeSessions" :key="session.id" class="flex items-center justify-between p-4 rounded-lg border" :class="session.current && 'ring-2 ring-primary'">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                    <Monitor class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-medium text-foreground">{{ session.device }}</h4>
                      <Badge v-if="session.current" variant="default" class="text-xs">Current</Badge>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Globe class="h-3 w-3" />
                      {{ session.location }}
                    </div>
                    <p class="text-xs text-muted-foreground">IP: {{ session.ip }}</p>
                    <p class="text-xs text-muted-foreground">Last active: {{ session.lastActive }}</p>
                  </div>
                </div>
                <Button v-if="!session.current" variant="outline" size="sm" @click="revokeSession(session.id)">
                  Revoke
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20">
          <CardContent class="p-4">
            <div class="flex items-start gap-3">
              <AlertTriangle class="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="font-medium text-foreground">Security Tip</h4>
                <p class="text-sm text-muted-foreground mt-1">Regularly review your active sessions and revoke any you don't recognize to protect your account.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Login History</CardTitle>
            <CardDescription>View recent sign-in attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div v-for="attempt in loginHistory" :key="attempt.id" class="flex items-center justify-between p-4 rounded-lg border">
                <div class="flex items-center gap-3">
                  <div :class="['h-10 w-10 rounded-lg flex items-center justify-center', attempt.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-950' : 'bg-red-100 dark:bg-red-950']">
                    <component :is="attempt.status === 'success' ? CheckCircle2 : XCircle" :class="['h-5 w-5', attempt.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400']" />
                  </div>
                  <div>
                    <h4 class="font-medium text-foreground">{{ attempt.device }}</h4>
                    <p class="text-xs text-muted-foreground">{{ attempt.location }}</p>
                    <p class="text-xs text-muted-foreground">{{ attempt.date }} at {{ attempt.time }}</p>
                  </div>
                </div>
                <Badge :variant="attempt.status === 'success' ? 'default' : 'destructive'" :class="attempt.status === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' : ''">
                  {{ attempt.status === 'success' ? 'Success' : 'Failed' }}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="audit" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Audit Log</CardTitle>
            <CardDescription>Track all security-related activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div v-for="i in 8" :key="i" class="flex items-center justify-between p-4 rounded-lg border">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <History class="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 class="font-medium text-foreground">Password Changed</h4>
                    <p class="text-xs text-muted-foreground">by admin@company.com • {{ i * 2 }} hours ago</p>
                  </div>
                </div>
                <Badge variant="outline" class="text-xs">Security</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <Dialog v-model:open="showPasswordDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Enter your new password below</DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="current-password">Current Password</Label>
            <div class="relative">
              <Input id="current-password" :type="showCurrentPassword ? 'text' : 'password'" v-model="currentPassword" />
              <Button type="button" variant="ghost" size="icon" class="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7" @click="showCurrentPassword = !showCurrentPassword">
                <component :is="showCurrentPassword ? EyeOff : Eye" class="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div class="space-y-2">
            <Label for="new-password">New Password</Label>
            <div class="relative">
              <Input id="new-password" :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" />
              <Button type="button" variant="ghost" size="icon" class="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7" @click="showNewPassword = !showNewPassword">
                <component :is="showNewPassword ? EyeOff : Eye" class="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div class="space-y-2">
            <Label for="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" v-model="confirmPassword" />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="showPasswordDialog = false">Cancel</Button>
          <Button @click="updatePassword">Update Password</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
