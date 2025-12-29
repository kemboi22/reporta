<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  Eye,
  Filter,
  FileText,
  User,
  CheckCircle2,
  Calendar,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const searchQuery = ref("");
const selectedTemplate = ref("all");
const selectedStatus = ref("all");
const selectedDateRange = ref("7days");

const { data: reports, refresh: refreshReports } = await useLazyFetch(
  `/api/${organizationId}/reports`,
  {
    key: `reports-${organizationId}`,
    transform: (data) => data || [],
  },
);

const { data: templates, refresh: refreshTemplates } = await useLazyFetch(
  `/api/${organizationId}/templates`,
  {
    key: `templates-${organizationId}`,
    transform: (data) => data || [],
  },
);

const filteredReports = computed(() => {
  let filtered = reports.value || [];

  if (searchQuery.value) {
    filtered = filtered.filter((r: any) => 
      r.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.template?.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedStatus.value !== "all") {
    filtered = filtered.filter((r: any) => r.status === selectedStatus.value);
  }

  return filtered;
});

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    APPROVED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    UNDER_REVIEW: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const totalSubmitted = computed(() => reports.value?.length || 0);
const approvedReports = computed(() => (reports.value || []).filter((r: any) => r.status === "APPROVED").length);
const pendingReports = computed(() => (reports.value || []).filter((r: any) => r.status === "PENDING").length);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Submitted Reports</h1>
        <p class="text-muted-foreground mt-1">View and manage all submitted reports</p>
      </div>
      <Button>
        <Download class="h-4 w-4 mr-2" />
        Export All
      </Button>
    </div>

    <div class="grid md:grid-cols-4 gap-6">
      <Card>
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Total Submitted</p>
          <p class="text-3xl font-bold">{{ totalSubmitted }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Approved</p>
          <p class="text-3xl font-bold text-emerald-600">{{ approvedReports }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p class="text-3xl font-bold text-amber-600">{{ pendingReports }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Active Templates</p>
          <p class="text-3xl font-bold">{{ templates?.length || 0 }}</p>
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
              v-model="searchQuery"
              placeholder="Search reports..."
              class="pl-10"
            />
          </div>

          <Select v-model="selectedTemplate">
            <SelectTrigger class="w-48">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              <SelectItem
                v-for="template in templates"
                :key="template.id"
                :value="template.id"
              >
                {{ template.name }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedStatus">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <div v-if="!filteredReports || filteredReports.length === 0" class="text-center py-12 text-muted-foreground">
      <FileText class="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p>No submitted reports found.</p>
    </div>

    <div v-else class="space-y-4">
      <Card
        v-for="report in filteredReports"
        :key="report.id"
        class="border-border hover:shadow-md transition-all"
      >
        <CardContent class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText class="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 class="font-semibold text-foreground">{{ report.title }}</h4>
                <Badge class="bg-blue-100 text-blue-700 mt-1">
                  {{ report.template?.name || "Report" }}
                </Badge>
              </div>
            </div>

            <div class="flex gap-2">
              <Badge :class="getStatusColor(report.status)">{{ report.status }}</Badge>
              <span class="text-sm text-muted-foreground">
                {{ formatDate(report.createdAt) }}
              </span>
            </div>
          </div>

          <div class="grid md:grid-cols-3 gap-4 mt-4">
            <div>
              <p class="text-sm text-muted-foreground mb-2">Submitted By</p>
              <div class="flex items-center gap-2">
                <User class="h-4 w-4 text-muted-foreground" />
                <span class="font-medium">{{ report.submittedBy?.name || "Unknown" }}</span>
              </div>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-2">Department</p>
              <div class="flex items-center gap-2">
                <FileText class="h-4 w-4 text-muted-foreground" />
                <span class="font-medium">{{ report.department?.name || "N/A" }}</span>
              </div>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-2">Date</p>
              <div class="flex items-center gap-2">
                <Calendar class="h-4 w-4 text-muted-foreground" />
                <span class="font-medium">{{ formatDate(report.createdAt) }}</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" @click="navigateTo(`/${organizationId}/reports/view/${report.id}`)">
              <Eye class="h-4 w-4 mr-2" />
              View
            </Button>
            <Button variant="outline" size="sm">
              <Download class="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
