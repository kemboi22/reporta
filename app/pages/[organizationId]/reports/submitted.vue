<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Card,
  CardContent,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { RangeCalendar } from "~/components/ui/range-calendar";
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
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";
import { toast } from "vue-sonner";
import { authClient } from "~/lib/auth";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const searchQuery = ref("");
const selectedTemplate = ref("all");
const selectedStatus = ref("all");
const selectedDateRange = ref("all");
const customDateRange = ref<{ from: Date; to: Date } | undefined>(undefined);
const selectedDepartment = ref("all");
const sortBy = ref("newest");
const viewMode = ref<"grid" | "list" | "table">("grid");

const session = authClient.useSession();

const isApproving = ref<string | null>(null);
const isRejecting = ref<string | null>(null);
const isDeleting = ref<string | null>(null);
const showDeleteDialog = ref(false);
const reportToDelete = ref<string | null>(null);

const page = ref(1);
const limit = ref(12);

const { data: reportsResponse, refresh: refreshReports } = await useLazyFetch(
  () => `/api/${organizationId}/reports?page=${page.value}&limit=${limit.value}`,
  {
    key: `reports-${organizationId}`,
  },
);

const reports = computed(() => reportsResponse.value?.data || []);
const paginationMeta = computed(() => reportsResponse.value?.pagination || {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
});

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

const effectiveDateRange = computed(() => {
  if (!selectedDateRange.value || selectedDateRange.value === "all") {
    return null;
  }
  
  if (selectedDateRange.value === "custom" && customDateRange.value?.from && customDateRange.value?.to) {
    const fromDate = new Date(customDateRange.value.from);
    const toDate = new Date(customDateRange.value.to);
    toDate.setHours(23, 59, 59, 999);
    return { from: fromDate, to: toDate };
  } else if (!isNaN(parseInt(selectedDateRange.value))) {
    const now = new Date();
    const days = parseInt(selectedDateRange.value);
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return { from: cutoff, to: null };
  }
  return null;
});

watch([selectedDateRange, customDateRange], ([newRange, newCustom]) => {
  console.log("Date filter changed:");
  console.log("  selectedDateRange:", newRange);
  console.log("  customDateRange:", newCustom);
}, { deep: true });

const filteredReports = computed(() => {
  let filtered = reports.value?.filter((r: any) =>
    ["SUBMITTED", "APPROVED", "REJECTED", "IN_PROGRESS"].includes(r.status)
  ) || [];

  console.log("Initial filtered count:", filtered.length);
  console.log("Applying filters with effectiveDateRange:", effectiveDateRange.value);

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (r: any) =>
        r.title?.toLowerCase().includes(query) ||
        r.template?.name?.toLowerCase().includes(query) ||
        r.submittedBy?.name?.toLowerCase().includes(query),
    );
  }

  if (selectedTemplate.value !== "all") {
    filtered = filtered.filter(
      (r: any) => r.templateId === selectedTemplate.value,
    );
  }

  if (selectedStatus.value !== "all") {
    filtered = filtered.filter((r: any) => r.status === selectedStatus.value);
  }

  if (selectedDepartment.value !== "all") {
    filtered = filtered.filter(
      (r: any) => r.departmentId === selectedDepartment.value,
    );
  }

  if (effectiveDateRange.value && effectiveDateRange.value.from) {
    if (selectedDateRange.value === "custom" && effectiveDateRange.value.to) {
      const { from, to } = effectiveDateRange.value;
      const fromTime = from.getTime();
      const toTime = to.getTime();
      const beforeFilter = filtered.length;
      filtered = filtered.filter((r: any) => {
        const createdAt = new Date(r.createdAt);
        return createdAt.getTime() >= fromTime && createdAt.getTime() <= toTime;
      });
      console.log("Custom date filter: removed", beforeFilter - filtered.length, "reports");
    } else if (effectiveDateRange.value.from) {
      const { from: cutoff } = effectiveDateRange.value;
      const cutoffTime = cutoff.getTime();
      const beforeFilter = filtered.length;
      filtered = filtered.filter((r: any) => {
        return new Date(r.createdAt).getTime() >= cutoffTime;
      });
      console.log("Preset date filter:", selectedDateRange.value, "days: removed", beforeFilter - filtered.length, "reports");
    }
  }

  if (sortBy.value === "newest") {
    filtered.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else if (sortBy.value === "oldest") {
    filtered.sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  console.log("Final filtered count:", filtered.length);
  return filtered;
});

const getStatusInfo = (status: string) => {
  const info: Record<string, any> = {
    DRAFT: {
      color: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200",
      icon: Clock,
      label: "Draft",
    },
    IN_PROGRESS: {
      color: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
      icon: Clock,
      label: "In Progress",
    },
    SUBMITTED: {
      color:
        "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200",
      icon: FileText,
      label: "Submitted",
    },
    APPROVED: {
      color:
        "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
      icon: CheckCircle2,
      label: "Approved",
    },
    REJECTED: {
      color: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
      icon: AlertCircle,
      label: "Rejected",
    },
  };
  return (
    info[status] || {
      color: "bg-slate-100 text-slate-700",
      icon: FileText,
      label: status,
    }
  );
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
  const relevantReports = allReports.filter((r: any) =>
    ["SUBMITTED", "APPROVED", "REJECTED", "IN_PROGRESS"].includes(r.status)
  );
  return {
    total: paginationMeta.value.total,
    approved: relevantReports.filter((r: any) => r.status === "APPROVED")
      .length,
    pending: relevantReports.filter((r: any) =>
      ["SUBMITTED", "IN_PROGRESS"].includes(r.status),
    ).length,
    rejected: relevantReports.filter((r: any) => r.status === "REJECTED")
      .length,
  };
});

const clearFilters = () => {
  searchQuery.value = "";
  selectedTemplate.value = "all";
  selectedStatus.value = "all";
  selectedDepartment.value = "all";
  selectedDateRange.value = "all";
  customDateRange.value = undefined;
};

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value ||
    selectedTemplate.value !== "all" ||
    selectedStatus.value !== "all" ||
    selectedDepartment.value !== "all" ||
    selectedDateRange.value !== "all" ||
    (selectedDateRange.value === "custom" && customDateRange.value?.from && customDateRange.value?.to)
  );
});

const datePickerOpen = ref(false);
const datePickerRef = ref<any>(null);

const closeDatePicker = () => {
  datePickerOpen.value = false;
};

const formatCustomDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDateRangeLabel = (value: string) => {
  const labels: Record<string, string> = {
    "7": "Last 7 Days",
    "30": "Last 30 Days",
    "90": "Last 90 Days",
    "365": "Last Year",
  };
  return labels[value] || value;
};

const canApproveOrReject = (status: string) => {
  return ["SUBMITTED", "UNDER_REVIEW"].includes(status);
};

const approveReport = async (reportId: string) => {
  if (!session.value?.data?.user?.id) {
    toast.error("You must be logged in to approve reports");
    return;
  }

  isApproving.value = reportId;
  try {
    const response = await $fetch<{ success: boolean; data?: any; error?: string }>(
      `/api/${organizationId}/reports/${reportId}/approve`,
      {
        method: "POST",
        body: { reviewedBy: session.value.data?.user.id },
      },
    );

    if (response.success) {
      toast.success("Report approved successfully");
      refreshReports();
    } else {
      toast.error(response.error || "Failed to approve report");
    }
  } catch (error) {
    console.error("Failed to approve report:", error);
    toast.error("Failed to approve report");
  } finally {
    isApproving.value = null;
  }
};

const rejectReport = async (reportId: string) => {
  if (!session.value.data?.user?.id) {
    toast.error("You must be logged in to reject reports");
    return;
  }

  isRejecting.value = reportId;
  try {
    const response = await $fetch<{ success: boolean; data?: any; error?: string }>(
      `/api/${organizationId}/reports/${reportId}/reject`,
      {
        method: "POST",
        body: { reviewedBy: session.value.data?.user.id },
      },
    );

    if (response.success) {
      toast.success("Report rejected successfully");
      refreshReports();
    } else {
      toast.error(response.error || "Failed to reject report");
    }
  } catch (error) {
    console.error("Failed to reject report:", error);
    toast.error("Failed to reject report");
  } finally {
    isRejecting.value = null;
  }
};

const confirmDeleteReport = (reportId: string) => {
  reportToDelete.value = reportId;
  showDeleteDialog.value = true;
};

const deleteReport = async () => {
  if (!reportToDelete.value) return;

  isDeleting.value = reportToDelete.value;
  try {
    await $fetch(`/api/${organizationId}/reports/${reportToDelete.value}`, {
      method: "DELETE",
    });
    toast.success("Report deleted successfully");
    showDeleteDialog.value = false;
    reportToDelete.value = null;
    refreshReports();
  } catch (error) {
    console.error("Failed to delete report:", error);
    toast.error("Failed to delete report");
  } finally {
    isDeleting.value = null;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-foreground">Submitted Reports</h1>
        <p class="text-muted-foreground mt-1">
          {{ paginationMeta.total }} submitted report{{
            paginationMeta.total !== 1 ? "s" : ""
          }}
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
            <div
              class="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center"
            >
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
              <p class="text-2xl font-bold text-emerald-600">
                {{ stats.approved }}
              </p>
            </div>
            <div
              class="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center"
            >
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
              <p class="text-2xl font-bold text-blue-600">
                {{ stats.pending }}
              </p>
            </div>
            <div
              class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center"
            >
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
              <p class="text-2xl font-bold text-red-600">
                {{ stats.rejected }}
              </p>
            </div>
            <div
              class="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center"
            >
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
            <div
              class="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center"
            >
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
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
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

            <Popover v-model:open="datePickerOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="[
                    'w-[180px] justify-start text-left font-normal',
                    !selectedDateRange && 'text-muted-foreground'
                  ]"
                >
                  <Calendar class="mr-2 h-4 w-4" />
                  <template v-if="selectedDateRange === 'custom' && customDateRange?.from && customDateRange?.to">
                    {{ formatCustomDate(customDateRange.from) }} - {{ formatCustomDate(customDateRange.to) }}
                  </template>
                  <template v-else-if="selectedDateRange !== 'all'">
                    {{ getDateRangeLabel(selectedDateRange) }}
                  </template>
                  <template v-else>
                    Date Range
                  </template>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start" :side-offset="4">
                <div class="p-4 border-b">
                  <Select
                    v-model="selectedDateRange"
                    @update:model-value="() => {
                      if (selectedDateRange !== 'custom') {
                        closeDatePicker();
                      }
                    }"
                  >
                    <SelectTrigger class="w-[180px]">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7">Last 7 Days</SelectItem>
                      <SelectItem value="30">Last 30 Days</SelectItem>
                      <SelectItem value="90">Last 90 Days</SelectItem>
                      <SelectItem value="365">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <RangeCalendar
                  v-if="selectedDateRange === 'custom'"
                  :model-value="customDateRange"
                  :max="new Date()"
                  initial-focus
                  class="mt-2"
                  @update:model-value="(range: any) => {
                    customDateRange = range;
                    if (range?.from && range?.to) {
                      closeDatePicker();
                    }
                  }"
                />
                <div v-else class="p-4 text-center text-muted-foreground text-sm">
                  Select "Custom Range" to choose specific dates
                </div>
              </PopoverContent>
            </Popover>

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

    <div class="flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        Showing {{ (paginationMeta.page - 1) * paginationMeta.limit + 1 }} to 
        {{ Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total) }} 
        of {{ paginationMeta.total }} reports
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          :disabled="!paginationMeta.hasPrevPage"
          @click="page--; refreshReports()"
        >
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <div class="flex items-center gap-1">
          <Button
            v-for="p in paginationMeta.totalPages"
            :key="p"
            variant="outline"
            size="sm"
            :class="{ 'bg-primary text-primary-foreground': p === paginationMeta.page }"
            @click="page = p; refreshReports()"
          >
            {{ p }}
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          :disabled="!paginationMeta.hasNextPage"
          @click="page++; refreshReports()"
        >
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <div
      v-if="!filteredReports || filteredReports.length === 0"
      class="text-center py-16"
    >
      <div
        class="inline-flex h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4"
      >
        <FileText class="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-semibold mb-2">No reports found</h3>
      <p class="text-muted-foreground mb-6">
        {{
          hasActiveFilters
            ? "Try adjusting your filters or search query."
            : "No reports have been submitted yet."
        }}
      </p>
      <Button
        v-if="!hasActiveFilters"
        @click="navigateTo(`/${organizationId}/reports/templates`)"
      >
        Create a Report
      </Button>
    </div>

    <div
      v-else-if="viewMode === 'grid'"
      class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      <Card
        v-for="report in filteredReports"
        :key="report.id"
        class="group hover:shadow-lg transition-all border-border hover:border-primary/50 cursor-pointer"
        @click="navigateTo(`/${organizationId}/reports/view/${report.id}`)"
      >
        <CardContent class="p-5">
          <div class="flex items-start justify-between mb-3">
            <div
              class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
            >
              <FileText class="h-5 w-5 text-primary" />
            </div>
            <Badge :class="getStatusInfo(report.status).color" class="text-xs">
              <component
                :is="getStatusInfo(report.status).icon"
                class="w-3 h-3 mr-1"
              />
              {{ getStatusInfo(report.status).label }}
            </Badge>
          </div>

          <h4 class="font-semibold text-foreground line-clamp-1 mb-1">
            {{ report.title }}
          </h4>
          <p class="text-sm text-muted-foreground mb-3 line-clamp-1">
            {{ report.template?.name || "Report" }}
          </p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <User class="w-4 h-4" />
              <span class="truncate">{{
                report.submittedBy?.name || "Unknown"
              }}</span>
            </div>
            <div
              v-if="report.department"
              class="flex items-center gap-2 text-sm text-muted-foreground"
            >
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
              @click.stop="
                navigateTo(`/${organizationId}/reports/view/${report.id}`)
              "
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
            <Button v-else variant="outline" size="sm" @click.stop>
              <Download class="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              @click.stop="confirmDeleteReport(report.id)"
              :disabled="isDeleting === report.id"
            >
              <Trash2 class="h-3 w-3" />
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
              @click="
                navigateTo(`/${organizationId}/reports/view/${report.id}`)
              "
            >
              <TableCell>
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"
                  >
                    <FileText class="h-5 w-5 text-primary" />
                  </div>
                  <span class="font-medium">{{ report.title }}</span>
                </div>
              </TableCell>
              <TableCell>{{ report.template?.name || "Report" }}</TableCell>
              <TableCell>
                <Badge
                  :class="getStatusInfo(report.status).color"
                  class="text-xs"
                >
                  <component
                    :is="getStatusInfo(report.status).icon"
                    class="w-3 h-3 mr-1"
                  />
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
                    @click.stop="
                      navigateTo(`/${organizationId}/reports/view/${report.id}`)
                    "
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
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-red-600 hover:text-red-700 hover:bg-red-50"
                    @click.stop="confirmDeleteReport(report.id)"
                    :disabled="isDeleting === report.id"
                  >
                    <Trash2 v-if="isDeleting !== report.id" class="h-4 w-4" />
                    <Clock v-else class="h-4 w-4 animate-spin" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Dialog v-model:open="showDeleteDialog">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Report</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this report? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="showDeleteDialog = false">
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="deleteReport"
            :disabled="isDeleting !== null"
          >
            <Trash2
              v-if="isDeleting !== null"
              class="h-4 w-4 mr-2 animate-spin"
            />
            <Trash2 v-else class="h-4 w-4 mr-2" />
            {{ isDeleting !== null ? "Deleting..." : "Delete" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
