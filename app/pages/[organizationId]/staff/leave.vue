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
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Umbrella, Heart, Plane } from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const leaveBalances = ref([
  {
    type: "Annual Leave",
    remaining: 12,
    total: 20,
    icon: Plane,
    color: "bg-blue-100 text-blue-600",
  },
  {
    type: "Sick Leave",
    remaining: 7,
    total: 10,
    icon: Heart,
    color: "bg-red-100 text-red-600",
  },
  {
    type: "Personal Leave",
    remaining: 3,
    total: 5,
    icon: Umbrella,
    color: "bg-purple-100 text-purple-600",
  },
]);

const leaveRequests = ref([
  {
    id: 1,
    type: "Annual Leave",
    startDate: "2024-12-20",
    endDate: "2024-12-22",
    days: 3,
    reason: "Family vacation",
    status: "approved",
    approver: "Michael Chen",
    approvedDate: "2024-12-10",
  },
  {
    id: 2,
    type: "Sick Leave",
    startDate: "2024-12-15",
    endDate: "2024-12-15",
    days: 1,
    reason: "Medical appointment",
    status: "approved",
    approver: "Sarah Johnson",
    approvedDate: "2024-12-14",
  },
  {
    id: 3,
    type: "Personal Leave",
    startDate: "2024-12-28",
    endDate: "2024-12-29",
    days: 2,
    reason: "Personal matters",
    status: "pending",
    approver: null,
    approvedDate: null,
  },
]);

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-muted text-foreground border-border";
  }
};
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">My Leave</h1>
        <p class="text-muted-foreground mt-1">
          Manage your leave requests and balances
        </p>
      </div>
      <Button>
        <Plus class="h-4 w-4 mr-2" />
        Request Leave
      </Button>
    </div>

    <!-- Leave Balances -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card v-for="balance in leaveBalances" :key="balance.type">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div class="space-y-3">
              <div
                :class="[
                  'w-12 h-12 rounded-lg flex items-center justify-center',
                  balance.color,
                ]"
              >
                <component :is="balance.icon" class="h-6 w-6" />
              </div>
              <div>
                <p class="text-sm text-muted-foreground">{{ balance.type }}</p>
                <p class="text-3xl font-bold text-foreground">
                  {{ balance.remaining }}
                </p>
                <p class="text-sm text-muted-foreground mt-1">
                  of {{ balance.total }} days remaining
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Leave Requests -->
    <Card>
      <CardHeader>
        <CardTitle>Leave History</CardTitle>
        <CardDescription>Your recent leave requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div
            v-for="request in leaveRequests"
            :key="request.id"
            class="p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-2 flex-1">
                <div class="flex items-center gap-3">
                  <h3 class="font-semibold text-foreground">
                    {{ request.type }}
                  </h3>
                  <Badge
                    :class="getStatusColor(request.status)"
                    variant="outline"
                  >
                    {{ request.status }}
                  </Badge>
                </div>
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar class="h-4 w-4" />
                  <span
                    >{{ request.startDate }} to {{ request.endDate }} ({{
                      request.days
                    }}
                    {{ request.days === 1 ? "day" : "days" }})</span
                  >
                </div>
                <p class="text-sm text-muted-foreground">
                  <span class="font-medium">Reason:</span> {{ request.reason }}
                </p>
                <div
                  v-if="request.status === 'approved'"
                  class="text-sm text-muted-foreground"
                >
                  Approved by {{ request.approver }} on
                  {{ request.approvedDate }}
                </div>
              </div>
              <Button
                v-if="request.status === 'pending'"
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
