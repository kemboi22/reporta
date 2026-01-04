<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta, navigateTo } from "#imports";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Star,
  FileText,
  Users,
} from "lucide-vue-next";
import { canManageHR } from "~/utils";

definePageMeta({
  layout: "dashboard",
});

if (!canManageHR()) {
  const route = useRoute();
  const orgId = route.params.organizationId as string;
  navigateTo(`/${orgId}/dashboard`);
}

const viewMode = ref("grid");
const searchQuery = ref("");
const filterStatus = ref("all");

const appraisals = ref([
  {
    id: 1,
    employee: {
      name: "Sarah Johnson",
      role: "Senior Developer",
      avatar: "/placeholder-user.jpg",
      initials: "SJ",
    },
    period: "Q4 2024",
    status: "completed",
    score: 4.5,
    completedDate: "2024-12-15",
    reviewer: "Michael Chen",
    goals: 8,
    goalsCompleted: 7,
  },
  {
    id: 2,
    employee: {
      name: "Michael Chen",
      role: "Project Manager",
      avatar: "/placeholder-user.jpg",
      initials: "MC",
    },
    period: "Q4 2024",
    status: "in-progress",
    score: null,
    completedDate: null,
    reviewer: "Emma Wilson",
    goals: 10,
    goalsCompleted: 6,
  },
  {
    id: 3,
    employee: {
      name: "Emma Wilson",
      role: "HR Manager",
      avatar: "/placeholder-user.jpg",
      initials: "EW",
    },
    period: "Q4 2024",
    status: "pending",
    score: null,
    completedDate: null,
    reviewer: "David Brown",
    goals: 7,
    goalsCompleted: 0,
  },
  {
    id: 4,
    employee: {
      name: "John Smith",
      role: "Sales Representative",
      avatar: "/placeholder-user.jpg",
      initials: "JS",
    },
    period: "Q4 2024",
    status: "completed",
    score: 4.2,
    completedDate: "2024-12-10",
    reviewer: "Sarah Johnson",
    goals: 6,
    goalsCompleted: 6,
  },
]);

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "in-progress":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "pending":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-muted text-foreground border-border";
  }
};

const getScoreColor = (score: number) => {
  if (score >= 4.5) return "text-green-600";
  if (score >= 3.5) return "text-blue-600";
  if (score >= 2.5) return "text-orange-600";
  return "text-red-600";
};
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-foreground">
          Performance Appraisals
        </h1>
        <p class="text-muted-foreground mt-1">
          Track and manage employee performance reviews
        </p>
      </div>
      <Button>
        <Plus class="h-4 w-4 mr-2" />
        New Appraisal
      </Button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Total Reviews</p>
              <p class="text-2xl font-bold text-foreground">248</p>
            </div>
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <FileText class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Completed</p>
              <p class="text-2xl font-bold text-green-600">186</p>
            </div>
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <Award class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">In Progress</p>
              <p class="text-2xl font-bold text-blue-600">42</p>
            </div>
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <TrendingUp class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Avg Score</p>
              <p class="text-2xl font-bold text-purple-600">4.3</p>
            </div>
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <Star class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filters -->
    <Card>
      <CardContent class="p-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search employees..."
              class="pl-10"
            />
          </div>
          <Select v-model="filterStatus">
            <SelectTrigger class="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter class="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Appraisals Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="appraisal in appraisals"
        :key="appraisal.id"
        class="hover:shadow-md transition-shadow cursor-pointer"
      >
        <CardHeader>
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <Avatar class="h-12 w-12">
                <AvatarImage :src="appraisal.employee.avatar" />
                <AvatarFallback class="bg-blue-100 text-blue-700">
                  {{ appraisal.employee.initials }}
                </AvatarFallback>
              </Avatar>
              <div>
                <p class="font-semibold text-foreground">
                  {{ appraisal.employee.name }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ appraisal.employee.role }}
                </p>
              </div>
            </div>
            <Badge :class="getStatusColor(appraisal.status)" variant="outline">
              {{ appraisal.status }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Period</span>
              <span class="font-medium text-foreground">{{
                appraisal.period
              }}</span>
          </div>

          <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Reviewer</span>
              <span class="font-medium text-foreground">{{
                appraisal.reviewer
              }}</span>
          </div>

          <div v-if="appraisal.score" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Overall Score</span>
              <div class="flex items-center gap-1">
                <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span
                  :class="['font-bold text-lg', getScoreColor(appraisal.score)]"
                >
                  {{ appraisal.score }}
                </span>
                  <span class="text-muted-foreground">/5.0</span>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Goals Progress</span>
              <span class="font-medium text-foreground">
                {{ appraisal.goalsCompleted }}/{{ appraisal.goals }}
              </span>
            </div>
            <Progress
              :model-value="(appraisal.goalsCompleted / appraisal.goals) * 100"
              class="h-2"
            />
          </div>

          <div
            v-if="appraisal.completedDate"
            class="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Calendar class="h-4 w-4" />
            <span>Completed {{ appraisal.completedDate }}</span>
          </div>

          <Button variant="outline" class="w-full"> View Details </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
