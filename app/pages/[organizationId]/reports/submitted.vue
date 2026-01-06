<script setup lang="ts">
import { ref, computed } from "vue";
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
  Clock,
  AlertCircle,
  MoreVertical,
  Grid3x3,
  List,
  Building,
  Check,
  X,
  Table as TableIcon,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";
import { toast } from "vue-sonner";
import { authClient } from "~/lib/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const searchQuery = ref("");
const selectedTemplate = ref("all");
const selectedStatus = ref("all");
const selectedDateRange = ref("all");
const selectedDepartment = ref("all");
const sortBy = ref("newest");
const viewMode = ref<"grid" | "list" | "table">("grid");

const { data: session } = await authClient.useSession();

const isApproving = ref<string | null>(null);
const isRejecting = ref<string | null>(null);

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

const { data: departments } = await useLazyFetch(
  `/api/${organizationId}/departments`,
  {
    key: `departments-${organizationId}`,
    transform: (data) => data || [],
  },
);

const filteredReports = computed(() => {
  let filtered = reports.value?.filter((r: any) => r.status === "SUBMITTED") || [];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((r: any) =>
      r.title?.toLowerCase().includes(query) ||
      r.template?.name?.toLowerCase().includes(query) ||
      r.submittedBy?.name?.toLowerCase().includes(query)
    );
  }

  if (selectedTemplate.value !== "all") {
    filtered = filtered.filter((r: any) => r.templateId === selectedTemplate.value);
  }

  if (selectedStatus.value !== "all") {
    filtered = filtered.filter((r: any) => r.status === selectedStatus.value);
  }

  if (selectedDepartment.value !== "all") {
    filtered = filtered.filter((r: any) => r.departmentId === selectedDepartment.value);
  }

  if (selectedDateRange.value !== "all") {
    const now = new Date();
    const days = parseInt(selectedDateRange.value);
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    filtered = filtered.filter((r: any) => new Date(r.createdAt) >= cutoff);
  }

  if (sortBy.value === "newest") {
    filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy.value === "oldest") {
    filtered.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  return filtered;
});

const getStatusInfo = (status: string) => {
  const info: Record<string, any> = {
    DRAFT: { color: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200", icon: Clock, label: "Draft" },
    IN_PROGRESS: { color: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200", icon: Clock, label: "In Progress" },
    SUBMITTED: { color: "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200", icon: FileText, label: "Submitted" },
    APPROVED: { color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200", icon: CheckCircle2, label: "Approved" },
    REJECTED: { color: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200", icon: AlertCircle, label: "Rejected" },
  };
  return info[status] || { color: "bg-slate-100 text-slate-700", icon: FileText, label: status };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
};

const stats = computed(() => {
  const allReports = reports.value || [];
  const submittedReports = allReports.filter((r: any) => r.status === "SUBMITTED");
  return {
    total: submittedReports.length,
    approved: submittedReports.filter((r: any) => r.status === "APPROVED").length,
    pending: submittedReports.filter((r: any) => ["SUBMITTED", "IN_PROGRESS"].includes(r.status)).length,
    rejected: submittedReports.filter((r: any) => r.status === "REJECTED").length,
    draft: submittedReports.filter((r: any) => r.status === "DRAFT").length,
  };
});

const clearFilters = () => {
  searchQuery.value = "";
  selectedTemplate.value = "all";
  selectedStatus.value = "all";
  selectedDepartment.value = "all";
  selectedDateRange.value = "all";
};

const hasActiveFilters = computed(() => {
  return searchQuery.value || 
    selectedTemplate.value !== "all" || 
    selectedStatus.value !== "all" || 
    selectedDepartment.value !== "all" || 
    selectedDateRange.value !== "all";
});

const canApproveOrReject = (status: string) => {
  return ["SUBMITTED", "UNDER_REVIEW"].includes(status);
};

const approveReport = async (reportId: string) => {
  if (!session.value?.user?.id) {
    toast.error("You must be logged in to approve reports");
    return;
  }

  isApproving.value = reportId;
  try {
    await $fetch(`/api/${organizationId}/reports/${reportId}/approve`, {
      method: "POST",
      body: { reviewedBy: session.value.user.id },
    });
    toast.success("Report approved successfully");
    refreshReports();
  } catch (error) {
    console.error("Failed to approve report:", error);
    toast.error("Failed to approve report");
  } finally {
    isApproving.value = null;
  }
};

const rejectReport = async (reportId: string) => {
  if (!session.value?.user?.id) {
    toast.error("You must be logged in to reject reports");
    return;
  }

  isRejecting.value = reportId;
  try {
    await $fetch(`/api/${organizationId}/reports/${reportId}/reject`, {
      method: "POST",
      body: { reviewedBy: session.value.user.id },
    });
    toast.success("Report rejected successfully");
    refreshReports();
  } catch (error) {
    console.error("Failed to reject report:", error);
    toast.error("Failed to reject report");
  } finally {
    isRejecting.value = null;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Submitted Reports</h1>
        <p class="text-muted-foreground mt-1">
          {{ filteredReports.length }} submitted report{{ filteredReports.length !== 1 ? "s" : "" }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex bg-muted rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            :class="viewMode === 'grid' ? 'bg-background shadow-sm' : ''"
            @click="viewMode = 'grid'"
          >
            <Grid3x3 class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            :class="viewMode === 'list' ? 'bg-background shadow-sm' : ''"
            @click="viewMode = 'list'"
          >
            <List class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            :class="viewMode === 'table' ? 'bg-background shadow-sm' : ''"
            @click="viewMode = 'table'"
          >
            <TableIcon class="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" v-if="hasActiveFilters" @click="clearFilters">
          Clear Filters
        </Button>
        <Button>
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Total Reports</p>
              <p class="text-2xl font-bold">{{ stats.total }}</p>
            </div>
            <div class="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <FileText class="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Approved</p>
              <p class="text-2xl font-bold text-emerald-600">{{ stats.approved }}</p>
            </div>
            <div class="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 class="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Pending</p>
              <p class="text-2xl font-bold text-blue-600">{{ stats.pending }}</p>
            </div>
            <div class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock class="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Rejected</p>
              <p class="text-2xl font-bold text-red-600">{{ stats.rejected }}</p>
            </div>
            <div class="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle class="h-5 w-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Drafts</p>
              <p class="text-2xl font-bold text-slate-600">{{ stats.draft }}</p>
            </div>
            <div class="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <FileText class="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardContent class="p-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Search reports, templates, or users..."
              class="pl-10"
            />
          </div>

          <div class="flex flex-wrap gap-3">
            <Select v-model="selectedTemplate">
              <SelectTrigger class="w-[180px]">
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
              <SelectTrigger class="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select v-model="selectedDepartment">
              <SelectTrigger class="w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem
                  v-for="dept in departments"
                  :key="dept.id"
                  :value="dept.id"
                >
                  {{ dept.name }}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select v-model="selectedDateRange">
              <SelectTrigger class="w-[140px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Select v-model="sortBy">
              <SelectTrigger class="w-[130px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <div v-if="!filteredReports || filteredReports.length === 0" class="text-center py-16">
      <div class="inline-flex h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText class="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-semibold mb-2">No reports found</h3>
      <p class="text-muted-foreground mb-6">
        {{ hasActiveFilters ? "Try adjusting your filters or search query." : "No reports have been submitted yet." }}
      </p>
      <Button v-if="!hasActiveFilters" @click="navigateTo(`/${organizationId}/reports/templates`)">
        Create a Report
      </Button>
    </div>

    <div v-else-if="viewMode === 'grid'" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <Card
        v-for="report in filteredReports"
        :key="report.id"
        class="group hover:shadow-lg transition-all border-border hover:border-primary/50 cursor-pointer"
        @click="navigateTo(`/${organizationId}/reports/view/${report.id}`)"
      >
        <CardContent class="p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <FileText class="h-5 w-5 text-primary" />
            </div>
            <Badge :class="getStatusInfo(report.status).color" class="text-xs">
              <component :is="getStatusInfo(report.status).icon" class="w-3 h-3 mr-1" />
              {{ getStatusInfo(report.status).label }}
            </Badge>
          </div>

          <h4 class="font-semibold text-foreground line-clamp-1 mb-1">{{ report.title }}</h4>
          <p class="text-sm text-muted-foreground mb-3 line-clamp-1">
            {{ report.template?.name || "Report" }}
          </p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <User class="w-4 h-4" />
              <span class="truncate">{{ report.submittedBy?.name || "Unknown" }}</span>
            </div>
            <div v-if="report.department" class="flex items-center gap-2 text-sm text-muted-foreground">
              <Building class="w-4 h-4" />
              <span class="truncate">{{ report.department.name }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar class="w-4 h-4" />
              <span>{{ formatDate(report.createdAt) }}</span>
            </div>
          </div>

          <div class="pt-3 border-t flex gap-2">
            <Button
              variant="outline"
              size="sm"
              class="flex-1"
              @click.stop="navigateTo(`/${organizationId}/reports/view/${report.id}`)"
            >
              <Eye class="h-3 w-3 mr-1" />
              View
            </Button>
            <template v-if="canApproveOrReject(report.status)">
              <Button
                variant="outline"
                size="sm"
                class="flex-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                @click.stop="approveReport(report.id)"
                :disabled="isApproving === report.id"
              >
                <Check class="h-3 w-3 mr-1" />
                {{ isApproving === report.id ? "..." : "Approve" }}
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                @click.stop="rejectReport(report.id)"
                :disabled="isRejecting === report.id"
              >
                <X class="h-3 w-3" />
              </Button>
            </template>
            <Button
              v-else
              variant="outline"
              size="sm"
              @click.stop
            >
              <Download class="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Table View -->
    <Card v-else-if="viewMode === 'table'" class="shadow-sm">
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="report in filteredReports"
              :key="report.id"
              class="cursor-pointer"
              @click="navigateTo(`/${organizationId}/reports/view/${report.id}`)"
            >
              <TableCell>
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText class="h-5 w-5 text-primary" />
                  </div>
                  <span class="font-medium">{{ report.title }}</span>
                </div>
              </TableCell>
              <TableCell>{{ report.template?.name || "Report" }}</TableCell>
              <TableCell>
                <Badge :class="getStatusInfo(report.status).color" class="text-xs">
                  <component :is="getStatusInfo(report.status).icon" class="w-3 h-3 mr-1" />
                  {{ getStatusInfo(report.status).label }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <User class="h-4 w-4 text-muted-foreground" />
                  <span>{{ report.submittedBy?.name || "Unknown" }}</span>
                </div>
              </TableCell>
              <TableCell>
                <div v-if="report.department" class="flex items-center gap-2">
                  <Building class="h-4 w-4 text-muted-foreground" />
                  <span>{{ report.department.name }}</span>
                </div>
                <span v-else class="text-muted-foreground">-</span>
              </TableCell>
              <TableCell>{{ formatDate(report.createdAt) }}</TableCell>
              <TableCell class="text-right">
                <div class="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    @click.stop="navigateTo(`/${organizationId}/reports/view/${report.id}`)"
                  >
                    <Eye class="h-4 w-4" />
                  </Button>
                  <template v-if="canApproveOrReject(report.status)">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      @click.stop="approveReport(report.id)"
                      :disabled="isApproving === report.id"
                    >
                      <Check v-if="isApproving !== report.id" class="h-4 w-4" />
                      <Clock v-else class="h-4 w-4 animate-spin" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="text-red-600 hover:text-red-700 hover:bg-red-50"
                      @click.stop="rejectReport(report.id)"
                      :disabled="isRejecting === report.id"
                    >
                      <X v-if="isRejecting !== report.id" class="h-4 w-4" />
                      <Clock v-else class="h-4 w-4 animate-spin" />
                    </Button>
                  </template>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
