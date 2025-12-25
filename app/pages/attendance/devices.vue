<script setup lang="ts">
import {
  Plus,
  Wifi,
  WifiOff,
  RefreshCw,
  Settings,
  Fingerprint,
  Camera,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const showAddDeviceDialog = ref(false);

const devices = [
  {
    id: 1,
    name: "Main Entrance Scanner",
    deviceId: "DEV001",
    type: "Fingerprint",
    location: "Main Building - Entrance",
    status: "Online",
    lastSync: "2 min ago",
    todayScans: 145,
    ipAddress: "192.168.1.100",
  },
  {
    id: 2,
    name: "ER Wing Scanner",
    deviceId: "DEV002",
    type: "Fingerprint",
    location: "Emergency Wing - Staff Area",
    status: "Online",
    lastSync: "5 min ago",
    todayScans: 89,
    ipAddress: "192.168.1.101",
  },
  {
    id: 3,
    name: "Pharmacy Exit",
    deviceId: "DEV003",
    type: "Face Recognition",
    location: "Pharmacy Department",
    status: "Offline",
    lastSync: "2 hours ago",
    todayScans: 32,
    ipAddress: "192.168.1.102",
  },
  {
    id: 4,
    name: "Surgery Wing Scanner",
    deviceId: "DEV004",
    type: "Fingerprint",
    location: "Surgery Wing - Entrance",
    status: "Online",
    lastSync: "1 min ago",
    todayScans: 67,
    ipAddress: "192.168.1.103",
  },
];

const getStatusColor = (status: string) => {
  return status === "Online"
    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
    : "bg-red-50 text-red-600 hover:bg-red-100";
};

const getDeviceIcon = (type: string) => {
  return type === "Face Recognition" ? Camera : Fingerprint;
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Biometric Devices</h1>
        <p class="text-muted-foreground mt-1">Manage attendance tracking devices</p>
      </div>

      <Dialog v-model:open="showAddDeviceDialog">
        <DialogTrigger as-child>
          <Button class="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus class="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Biometric Device</DialogTitle>
            <DialogDescription
              >Configure a new attendance tracking device</DialogDescription
            >
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="space-y-2">
              <Label htmlFor="deviceName">Device Name</Label>
              <Input id="deviceName" placeholder="Main Entrance Scanner" />
            </div>
            <div class="space-y-2">
              <Label htmlFor="deviceId">Device ID</Label>
              <Input id="deviceId" placeholder="DEV005" />
            </div>
            <div class="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Building A - Floor 1" />
            </div>
            <div class="space-y-2">
              <Label htmlFor="ipAddress">IP Address</Label>
              <Input id="ipAddress" placeholder="192.168.1.100" />
            </div>
            <div class="flex justify-end gap-3">
              <Button variant="outline" @click="showAddDeviceDialog = false"
                >Cancel</Button
              >
              <Button class="bg-blue-500 hover:bg-blue-600 text-white"
                >Add Device</Button
              >
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Stats -->
    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-border">
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Total Devices</p>
          <p class="text-3xl font-bold text-foreground">4</p>
          <p class="text-sm text-emerald-500 mt-2">All configured</p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Online</p>
          <p class="text-3xl font-bold text-emerald-500">3</p>
          <p class="text-sm text-muted-foreground mt-2">75% uptime</p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Today's Scans</p>
          <p class="text-3xl font-bold text-blue-500">333</p>
          <p class="text-sm text-muted-foreground mt-2">Clock ins/outs</p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Offline</p>
          <p class="text-3xl font-bold text-red-500">1</p>
          <p class="text-sm text-muted-foreground mt-2">Requires attention</p>
        </CardContent>
      </Card>
    </div>

    <!-- Devices Grid -->
    <div class="grid md:grid-cols-2 gap-6">
      <Card
        v-for="device in devices"
        :key="device.id"
        :class="[
          'border-border',
          device.status === 'Offline' && 'border-red-300',
        ]"
      >
        <CardContent class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center"
              >
                <component
                  :is="getDeviceIcon(device.type)"
                  class="h-6 w-6 text-blue-500"
                />
              </div>
              <div>
                <h3 class="font-semibold text-foreground">{{ device.name }}</h3>
                <p class="text-sm text-muted-foreground">{{ device.deviceId }}</p>
                <Badge
                  class="mt-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >{{ device.type }}</Badge
                >
              </div>
            </div>

            <Badge :class="getStatusColor(device.status)">
              <component
                :is="device.status === 'Online' ? Wifi : WifiOff"
                class="h-3 w-3 mr-1"
              />
              {{ device.status }}
            </Badge>
          </div>

          <div class="space-y-3 pt-4 border-t border-border">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Location</span>
              <span class="font-medium text-foreground">{{
                device.location
              }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">IP Address</span>
              <span class="font-mono text-sm text-foreground">{{
                device.ipAddress
              }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Last Sync</span>
              <span class="text-foreground">{{ device.lastSync }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Today's Scans</span>
              <span class="font-semibold text-blue-500">{{
                device.todayScans
              }}</span>
            </div>
          </div>

          <div class="flex gap-2 mt-4 pt-4 border-t border-border">
            <Button variant="outline" size="sm" class="flex-1">
              <RefreshCw class="h-4 w-4 mr-2" />
              Sync Now
            </Button>
            <Button variant="outline" size="sm" class="flex-1">
              <Settings class="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Device Logs -->
    <Card class="border-border">
      <CardContent class="p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">
          Recent Device Activity
        </h3>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 border border-border rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div>
                <p class="text-sm font-medium text-foreground">
                  Main Entrance Scanner synced successfully
                </p>
                <p class="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <Badge class="bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              >Success</Badge
            >
          </div>

          <div
            class="flex items-center justify-between p-3 border border-border rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p class="text-sm font-medium text-foreground">
                  Pharmacy Exit connection lost
                </p>
                <p class="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <Badge class="bg-red-50 text-red-600 hover:bg-red-100"
              >Error</Badge
            >
          </div>

          <div
            class="flex items-center justify-between p-3 border border-border rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p class="text-sm font-medium text-foreground">
                  Surgery Wing Scanner firmware updated
                </p>
                <p class="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <Badge class="bg-blue-50 text-blue-600 hover:bg-blue-100"
              >Update</Badge
            >
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
