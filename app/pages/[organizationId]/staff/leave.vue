<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const { data: leaveRequests, refresh: refreshLeaveRequests } = await useLazyFetch(`/api/${organizationId}/leave-requests`, {
  key: `leave-requests-${organizationId}`,
  transform: (data) => data || [],
});

const showCreateDialog = ref(false);
const newLeave = ref({
  type: "VACATION",
  startDate: "",
  endDate: "",
  reason: "",
});

const createLeave = async () => {
  try {
    await $fetch(`/api/${organizationId}/leave-requests`, {
      method: "POST",
      body: newLeave.value,
    });
    showCreateDialog.value = false;
    newLeave.value = {
      type: "VACATION",
      startDate: "",
      endDate: "",
      reason: "",
    };
    await refreshLeaveRequests();
  } catch (error) {
    console.error("Failed to create leave:", error);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">My Leave</h1>
        <p class="text-muted-foreground mt-1">Manage your leave requests</p>
      </div>
      <Button @click="showCreateDialog = true">
        <Plus class="h-4 w-4 mr-2" />
        Request Leave
      </Button>
    </div>

    <div v-if="!leaveRequests || leaveRequests.length === 0" class="text-center py-12 text-muted-foreground">
      No leave requests yet.
    </div>

    <div v-else class="space-y-4">
      <Card v-for="request in leaveRequests" :key="request.id">
        <CardContent class="p-6 space-y-4">
          <div class="flex justify-between">
            <Badge>
              {{ request.type }}
            </Badge>
            <span class="text-sm text-muted-foreground">
              {{ new Date(request.createdAt).toLocaleDateString() }}
            </span>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <p class="font-medium">
                {{ new Date(request.startDate).toLocaleDateString() }} - {{ new Date(request.endDate).toLocaleDateString() }}
              </p>
              <p class="text-sm text-muted-foreground">({{request.days || 0}} days)</p>
            </div>
            <Badge>{{ request.status }}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  <Dialog v-model:open="showCreateDialog">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Request Leave</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <div>
          <Label>Type</Label>
          <Select v-model="newLeave.type">
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VACATION">Vacation</SelectItem>
              <SelectItem value="SICK">Sick</SelectItem>
              <SelectItem value="PERSONAL">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Input v-model="newLeave.startDate" type="date" />
          </div>
          <div>
            <Label>End Date</Label>
            <Input v-model="newLeave.endDate" type="date" />
          </div>
        </div>
        <div>
          <Label>Reason</Label>
          <Textarea v-model="newLeave.reason" placeholder="Enter reason for leave..." />
        </div>
        <div class="flex justify-end gap-3">
          <Button @click="createLeave" :disabled="!newLeave.type || !newLeave.startDate || !newLeave.endDate">
            Submit Request
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
