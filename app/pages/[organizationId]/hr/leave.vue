<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Search, Check, X, Clock } from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const { data: leaveRequests, refresh: refreshLeaveRequests } = await useLazyFetch(
  `/api/${organizationId}/leave-requests`,
  {
    key: `leave-requests-${organizationId}`,
    transform: (data) => data || [],
  },
);

const { data: staff } = await useLazyFetch(`/api/${organizationId}/staff`, {
  key: `staff-${organizationId}`,
  transform: (data) => data || [],
});

const selectedStatus = ref("all");
const selectedType = ref("all");
const showApproveDialog = ref(false);
const showRejectDialog = ref(false);
const selectedRequest = ref<any>(null);
const rejectionReason = ref("");

const filteredRequests = computed(() => {
  let filtered = leaveRequests.value || [];
  
  if (selectedStatus.value !== "all") {
    filtered = filtered.filter((r: any) => r.status === selectedStatus.value);
  }
  
  if (selectedType.value !== "all") {
    filtered = filtered.filter((r: any) => r.type === selectedType.value);
  }
  
  return filtered;
});

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-500 hover:bg-amber-50",
    APPROVED: "bg-emerald-50 text-emerald-500 hover:bg-emerald-50",
    REJECTED: "bg-red-50 text-red-500 hover:bg-red-50",
  };
  return colors[status] || "bg-gray-50 text-gray-500";
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    SICK: "bg-red-100 text-red-700",
    VACATION: "bg-blue-100 text-blue-700",
    PERSONAL: "bg-purple-100 text-purple-700",
    MATERNITY: "bg-pink-100 text-pink-700",
    UNPAID: "bg-gray-100 text-gray-700",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
};

const approveRequest = async () => {
  if (!selectedRequest.value) return;

  try {
    await $fetch(`/api/${organizationId}/leave-requests/${selectedRequest.value.id}/approve`, {
      method: "POST",
    });
    showApproveDialog.value = false;
    selectedRequest.value = null;
    await refreshLeaveRequests();
  } catch (error) {
    console.error("Failed to approve request:", error);
  }
};

const rejectRequest = async () => {
  if (!selectedRequest.value || !rejectionReason.value) return;

  try {
    await $fetch(`/api/${organizationId}/leave-requests/${selectedRequest.value.id}/reject`, {
      method: "POST",
      body: { reason: rejectionReason.value },
    });
    showRejectDialog.value = false;
    selectedRequest.value = null;
    rejectionReason.value = "";
    await refreshLeaveRequests();
  } catch (error) {
    console.error("Failed to reject request:", error);
  }
};

const totalLeave = computed(() => leaveRequests.value?.length || 0);
const pendingLeave = computed(() => (leaveRequests.value || []).filter((r: any) => r.status === "PENDING").length);
const approvedLeave = computed(() => (leaveRequests.value || []).filter((r: any) => r.status === "APPROVED").length);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Leave Management</h1>
        <p class="text-muted-foreground mt-1">Review and manage leave requests</p>
      </div>
      <Button class="bg-blue-600 hover:bg-blue-700 text-white">
        <Calendar class="h-4 w-4 mr-2" />
        View Calendar
      </Button>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Calendar class="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Total Requests</p>
              <p class="text-2xl font-bold">{{ totalLeave }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock class="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Pending</p>
              <p class="text-2xl font-bold text-amber-600">{{ pendingLeave }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Check class="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Approved</p>
              <p class="text-2xl font-bold text-emerald-600">{{ approvedLeave }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="border-border">
      <CardContent class="p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              placeholder="Search by staff name..."
              class="pl-10"
            />
          </div>

          <Select v-model="selectedStatus">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedType">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="SICK">Sick Leave</SelectItem>
              <SelectItem value="VACATION">Vacation</SelectItem>
              <SelectItem value="PERSONAL">Personal</SelectItem>
              <SelectItem value="MATERNITY">Maternity</SelectItem>
              <SelectItem value="UNPAID">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <div v-if="!leaveRequests || leaveRequests.length === 0" class="text-center py-12 text-muted-foreground">
      No leave requests found.
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="request in filteredRequests"
        :key="request.id"
        class="border-border"
      >
        <CardContent class="p-6">
          <div class="flex items-start gap-4">
            <Avatar class="h-12 w-12">
              <AvatarImage :src="request.staff?.user?.image" />
              <AvatarFallback class="bg-blue-100 text-blue-700">
                {{ getInitials(request.staff?.user?.name || "") }}
              </AvatarFallback>
            </Avatar>

            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-semibold text-foreground">{{ request.staff?.user?.name }}</h4>
                <Badge :class="getTypeColor(request.type)">{{ request.type }}</Badge>
              </div>

              <p class="text-sm text-muted-foreground">{{ request.staff?.position || "" }}</p>

              <div class="mt-3 space-y-2">
                <div class="flex items-center gap-2 text-sm">
                  <span class="text-muted-foreground">Period:</span>
                  <span class="font-medium">{{ new Date(request.startDate).toLocaleDateString() }} - {{ new Date(request.endDate).toLocaleDateString() }}</span>
                  <span class="font-medium">({{request.days || 0}} days)</span>
                </div>

                <div class="text-sm">
                  <span class="text-muted-foreground">Reason:</span>
                  <span class="font-medium">{{ request.reason || "No reason provided" }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2 mt-3">
                <Badge :class="getStatusColor(request.status)">{{ request.status }}</Badge>
                <span class="text-xs text-muted-foreground">
                  Submitted {{ new Date(request.createdAt).toLocaleDateString() }}
                </span>
              </div>
            </div>

            <div class="flex gap-2 mt-4">
              <Button
                v-if="request.status === 'PENDING'"
                variant="outline"
                size="sm"
                @click="selectedRequest = request; showApproveDialog = true"
              >
                <Check class="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                v-if="request.status === 'PENDING'"
                variant="outline"
                size="sm"
                class="text-red-600 border-red-200"
                @click="selectedRequest = request; showRejectDialog = true"
              >
                <X class="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog v-model:open="showApproveDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Leave Request</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <p>Are you sure you want to approve this leave request for <strong>{{ selectedRequest?.staff?.user?.name }}</strong>?</p>
          <div class="flex justify-end gap-3">
            <Button variant="outline" @click="showApproveDialog = false">Cancel</Button>
            <Button @click="approveRequest">Approve</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showRejectDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Leave Request</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label for="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              v-model="rejectionReason"
              placeholder="Provide a reason for rejection..."
              rows="3"
            />
          </div>
          <p class="text-sm text-muted-foreground">
            Rejecting leave request for <strong>{{ selectedRequest?.staff?.user?.name }}</strong>
          </p>
          <div class="flex justify-end gap-3">
            <Button variant="outline" @click="showRejectDialog = false">Cancel</Button>
            <Button variant="destructive" @click="rejectRequest">Reject</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
