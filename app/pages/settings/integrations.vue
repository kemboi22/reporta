<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta } from "#imports";
import {
  Plug,
  ExternalLink,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Zap,
  Mail,
  Calendar as CalendarIcon,
  MessageSquare,
  Database,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

definePageMeta({
  layout: "dashboard",
});

const showConnectDialog = ref(false);
const selectedIntegration = ref<any>(null);

const integrations = ref([
  {
    id: 1,
    name: "Biometric Attendance",
    description: "Sync attendance data from fingerprint and face recognition devices",
    category: "Attendance",
    icon: Zap,
    color: "bg-blue-500",
    status: "connected",
    lastSync: "5 minutes ago",
  },
  {
    id: 2,
    name: "Microsoft 365",
    description: "Sync calendar events and manage team schedules",
    category: "Calendar",
    icon: CalendarIcon,
    color: "bg-purple-500",
    status: "connected",
    lastSync: "1 hour ago",
  },
  {
    id: 3,
    name: "Email Notifications",
    description: "Send automated emails for shifts, reports, and alerts",
    category: "Communication",
    icon: Mail,
    color: "bg-emerald-500",
    status: "connected",
    lastSync: "Just now",
  },
  {
    id: 4,
    name: "SMS Gateway",
    description: "Send SMS notifications for urgent updates and reminders",
    category: "Communication",
    icon: MessageSquare,
    color: "bg-amber-500",
    status: "disconnected",
    lastSync: null,
  },
  {
    id: 5,
    name: "QuickBooks",
    description: "Sync payroll and expense data for accounting",
    category: "Finance",
    icon: Database,
    color: "bg-green-500",
    status: "pending",
    lastSync: null,
  },
  {
    id: 6,
    name: "Google Calendar",
    description: "Two-way sync with Google Workspace calendars",
    category: "Calendar",
    icon: CalendarIcon,
    color: "bg-red-500",
    status: "disconnected",
    lastSync: null,
  },
]);

const availableIntegrations = [
  {
    id: 101,
    name: "Slack",
    description: "Team communication and notifications",
    category: "Communication",
  },
  {
    id: 102,
    name: "Stripe",
    description: "Payment processing and billing",
    category: "Finance",
  },
  {
    id: 103,
    name: "GitHub",
    description: "Project management and issue tracking",
    category: "Development",
  },
];

const openConnectDialog = (integration: any) => {
  selectedIntegration.value = integration;
  showConnectDialog.value = true;
};

const connectIntegration = () => {
  showConnectDialog.value = false;
};

const disconnectIntegration = (id: number) => {
  console.log("Disconnect integration:", id);
};

const syncIntegration = (id: number) => {
  console.log("Sync integration:", id);
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Integrations</h1>
      <p class="text-muted-foreground mt-1">Connect and manage third-party applications</p>
    </div>

    <Tabs default-value="connected" class="w-full">
      <TabsList class="grid w-full md:w-auto md:inline-grid grid-cols-3 bg-muted/50">
        <TabsTrigger value="connected">Connected</TabsTrigger>
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="history">Sync History</TabsTrigger>
      </TabsList>

      <TabsContent value="connected" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <Card v-for="integration in integrations" :key="integration.id" class="hover:shadow-md transition-all">
            <CardContent class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', integration.color, 'text-white']">
                    <component :is="integration.icon" class="h-6 w-6" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-foreground">{{ integration.name }}</h3>
                    <p class="text-xs text-muted-foreground">{{ integration.category }}</p>
                  </div>
                </div>
                <Badge :variant="integration.status === 'connected' ? 'default' : integration.status === 'pending' ? 'secondary' : 'outline'" :class="integration.status === 'connected' ? 'bg-emerald-500 hover:bg-emerald-600' : ''">
                  <template v-if="integration.status === 'connected'">
                    <CheckCircle2 class="h-3 w-3 mr-1" />
                    Connected
                  </template>
                  <template v-else-if="integration.status === 'pending'">
                    Pending
                  </template>
                  <template v-else>
                    <XCircle class="h-3 w-3 mr-1" />
                    Disconnected
                  </template>
                </Badge>
              </div>
              <p class="text-sm text-muted-foreground mb-4">{{ integration.description }}</p>
              <div v-if="integration.lastSync" class="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Zap class="h-3 w-3" />
                Last sync: {{ integration.lastSync }}
              </div>
              <div class="flex items-center gap-2">
                <Button v-if="integration.status === 'connected'" variant="outline" size="sm" @click="syncIntegration(integration.id)">
                  <Zap class="h-3.5 w-3.5 mr-1.5" />
                  Sync Now
                </Button>
                <Button v-if="integration.status === 'connected'" variant="outline" size="sm" @click="disconnectIntegration(integration.id)">
                  Disconnect
                </Button>
                <Button v-else variant="default" size="sm" @click="openConnectDialog(integration)">
                  <Plug class="h-3.5 w-3.5 mr-1.5" />
                  Connect
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreVertical class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <ExternalLink class="h-4 w-4 mr-2" />
                      View Documentation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Configure Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="available" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Browse Integrations</CardTitle>
            <CardDescription>Discover and connect new applications to extend functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card v-for="app in availableIntegrations" :key="app.id" class="cursor-pointer hover:shadow-md hover:border-primary transition-all" @click="openConnectDialog(app)">
                <CardContent class="p-4">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Plug class="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 class="font-medium text-foreground">{{ app.name }}</h4>
                      <Badge variant="secondary" class="text-xs mt-1">{{ app.category }}</Badge>
                    </div>
                  </div>
                  <p class="text-sm text-muted-foreground">{{ app.description }}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Sync History</CardTitle>
            <CardDescription>View recent synchronization activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div v-for="i in 5" :key="i" class="flex items-center justify-between p-3 rounded-lg border">
                <div class="flex items-center gap-3">
                  <CheckCircle2 class="h-4 w-4 text-emerald-500" />
                  <div>
                    <p class="font-medium text-foreground">Biometric Attendance</p>
                    <p class="text-xs text-muted-foreground">{{ i * 5 }} minutes ago</p>
                  </div>
                </div>
                <Badge variant="secondary" class="text-xs">Success</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <Dialog v-model:open="showConnectDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect {{ selectedIntegration?.name }}</DialogTitle>
          <DialogDescription>Configure your integration settings</DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">API Key</label>
            <input type="password" placeholder="Enter your API key" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Secret Key</label>
            <input type="password" placeholder="Enter your secret key" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div class="flex items-center space-x-2">
            <Switch id="auto-sync" />
            <label for="auto-sync" class="text-sm">Enable automatic sync</label>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="showConnectDialog = false">Cancel</Button>
          <Button @click="connectIntegration">Connect</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
