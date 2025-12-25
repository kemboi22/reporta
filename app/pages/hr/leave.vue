<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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

const selectedStatus = ref("all");
const selectedType = ref("all");

const leaveRequests = [
  {
    id: 1,
    staff: {
      name: "Sarah Johnson",
      employeeId: "EMP001",
      department: "Nursing",
      photo: "/placeholder-user.jpg",
    },
    type: "Annual Leave",
    startDate: "2024-12-25",
    endDate: "2024-12-27",
    days: 3,
    reason: "Family vacation during holidays",
    status: "Pending",
    submittedDate: "2024-12-15",
    coverage: "Mike Chen",
  },
  {
    id: 2,
    staff: {
      name: "Emma Davis",
      employeeId: "EMP003",
      department: "Pharmacy",
      photo: "/placeholder-user.jpg",
    },
    type: "Sick Leave",
    startDate: "2024-12-20",
    endDate: "2024-12-22",
    days: 3,
    reason: "Medical appointment and recovery",
    status: "Approved",
    submittedDate: "2024-12-18",
    coverage: "Lisa Anderson",
  },
  {
    id: 3,
    staff: {
      name: "James Wilson",
      employeeId: "EMP004",
      department: "Surgery",
      photo: "/placeholder-user.jpg",
    },
    type: "Personal Leave",
    startDate: "2024-12-28",
    endDate: "2024-12-30",
    days: 3,
    reason: "Personal matters",
    status: "Pending",
    submittedDate: "2024-12-16",
    coverage: "Robert Taylor",
  },
];

const leaveBalances = [
  { type: "Annual Leave", used: 8, total: 20, color: "bg-blue-600" },
  { type: "Sick Leave", used: 3, total: 10, color: "bg-emerald-600" },
  { type: "Personal Leave", used: 2, total: 5, color: "bg-purple-600" },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-500 hover:bg-amber-50",
    Approved: "bg-emerald-50 text-emerald-500 hover:bg-emerald-50",
    Rejected: "bg-red-50 text-red-500 hover:bg-red-50",
  };
  return colors[status] || "bg-muted text-muted-foreground";
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
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

    <!-- Leave Balance Overview -->
    <div class="grid md:grid-cols-3 gap-6">
      <Card
        v-for="balance in leaveBalances"
        :key="balance.type"
        class="border-border"
      >
        <CardContent class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-sm text-muted-foreground mb-1">{{ balance.type }}</p>
              <p class="text-2xl font-bold text-foreground">
                {{ balance.used }}/{{ balance.total }} days
              </p>
            </div>
            <div
              :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center',
                balance.color.replace('600', '100'),
              ]"
            >
              <Calendar
                :class="[balance.color.replace('bg-', 'text-'), 'h-6 w-6']"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Used</span>
              <span class="font-medium text-foreground"
                >{{ balance.used }} days</span
              >
            </div>
            <div class="w-full bg-muted rounded-full h-2">
              <div
                :class="[balance.color, 'h-2 rounded-full transition-all']"
                :style="{ width: `${(balance.used / balance.total) * 100}%` }"
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filters -->
    <Card class="border-border">
      <CardContent class="p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              placeholder="Search by staff name or employee ID..."
              class="pl-10"
            />
          </div>

          <Select v-model="selectedStatus">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedType">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Leave Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="annual">Annual Leave</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="personal">Personal Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Leave Requests -->
    <Tabs default-value="pending" class="space-y-6">
      <TabsList class="bg-muted">
        <TabsTrigger value="pending">Pending (2)</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
        <TabsTrigger value="all">All Requests</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" class="space-y-4">
        <Card
          v-for="request in leaveRequests.filter((r) => r.status === 'Pending')"
          :key="request.id"
          class="border-border"
        >
          <CardContent class="p-6">
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Staff Info -->
              <div class="flex items-start gap-4 flex-1">
                <Avatar class="h-12 w-12">
                  <AvatarImage :src="request.staff.photo" />
                  <AvatarFallback class="bg-blue-100 text-blue-700">
                    {{ getInitials(request.staff.name) }}
                  </AvatarFallback>
                </Avatar>

                <div class="flex-1">
                  <h3 class="font-semibold text-foreground">
                    {{ request.staff.name }}
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    {{ request.staff.employeeId }} •
                    {{ request.staff.department }}
                  </p>

                  <div class="flex items-center gap-4 mt-3">
                    <Badge
                      class="bg-blue-100 text-blue-700 hover:bg-blue-100"
                      >{{ request.type }}</Badge
                    >
                    <Badge :class="getStatusColor(request.status)">{{
                      request.status
                    }}</Badge>
                  </div>
                </div>
              </div>

              <!-- Leave Details -->
              <div class="flex-1 space-y-3">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">Start Date</p>
                    <p class="text-sm font-medium text-foreground">
                      {{ formatDate(request.startDate) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground mb-1">End Date</p>
                    <p class="text-sm font-medium text-foreground">
                      {{ formatDate(request.endDate) }}
                    </p>
                  </div>
                </div>

                <div>
                  <p class="text-xs text-muted-foreground mb-1">Duration</p>
                  <p class="text-sm font-medium text-foreground">
                    {{ request.days }} days
                  </p>
                </div>

                <div>
                  <p class="text-xs text-muted-foreground mb-1">Coverage</p>
                  <p class="text-sm font-medium text-foreground">
                    {{ request.coverage }}
                  </p>
                </div>

                <div>
                  <p class="text-xs text-muted-foreground mb-1">Reason</p>
                  <p class="text-sm text-foreground">{{ request.reason }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-2 md:w-32">
                <Button class="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Check class="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  class="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X class="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button variant="outline">
                  <Clock class="h-4 w-4 mr-2" />
                  Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="approved">
        <Card class="border-border">
          <CardContent class="p-12 text-center">
            <Calendar class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p class="text-muted-foreground">
              Approved leave requests will appear here
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rejected">
        <Card class="border-border">
          <CardContent class="p-12 text-center">
            <Calendar class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p class="text-muted-foreground">
              Rejected leave requests will appear here
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="all">
        <Card class="border-border">
          <CardContent class="p-12 text-center">
            <Calendar class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p class="text-muted-foreground">All leave requests will appear here</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
