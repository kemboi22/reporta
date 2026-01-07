<script setup lang="ts">
import {
  Search,
  Download,
  Eye,
  ArrowLeft,
  Calendar,
  FileText,
  User,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const templateId = route.params.templateId as string;

const searchQuery = ref("");
const selectedStatus = ref("all");
const sortBy = ref("newest");
const isLoading = ref(false);
const expandedRows = ref<Set<string>>(new Set());
const selectedReports = ref<Set<string>>(new Set());
const isApproving = ref(false);
const isDeleting = ref(false);
const showDeleteDialog = ref(false);
const reportToDelete = ref<string | null>(null);

const dateFrom = ref("");
const dateTo = ref("");

const { data: template, refresh: refreshTemplate } = await useLazyFetch(
  `/api/${organizationId}/templates/${templateId}`,
  { key: `template-${templateId}` },
);

const { data: reports, refresh: refreshReports } = await useLazyFetch(
  () => `/api/${organizationId}/reports?templateId=${templateId}`,
  { key: `template-reports-${templateId}` },
);

const templateFields = computed(() => {
  if (!template.value?.fields?.sections) return [];
  return template.value.fields.sections as any[];
});

const tableColumns = computed(() => {
  if (!templateFields.value || templateFields.value.length === 0) return [];

  const columns: any[] = [];
  templateFields.value.forEach((section: any) => {
    if (section.fields) {
      section.fields.forEach((field: any) => {
        columns.push({
          key: field.id,
          label: field.label || field.name,
          type: field.type,
          section: section.title,
        });
      });
    }
  });

  return columns;
});

const filteredReports = computed(() => {
  let filtered = reports.value || [];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((r: any) =>
      r.title?.toLowerCase().includes(query) || r.content
        ? JSON.stringify(r.content).toLowerCase().includes(query)
        : false,
    );
  }

  if (selectedStatus.value !== "all") {
    filtered = filtered.filter((r: any) => r.status === selectedStatus.value);
  }

  if (dateFrom.value) {
    const fromDate = new Date(dateFrom.value);
    filtered = filtered.filter((r: any) => new Date(r.createdAt) >= fromDate);
  }

  if (dateTo.value) {
    const toDate = new Date(dateTo.value);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter((r: any) => new Date(r.createdAt) <= toDate);
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

  return filtered;
});

const selectableReports = computed(() => {
  return filteredReports.value.filter((r: any) =>
    ["SUBMITTED", "UNDER_REVIEW"].includes(r.status),
  );
});

const stats = computed(() => {
  const allReports = reports.value || [];
  return {
    total: allReports.length,
    approved: allReports.filter((r: any) => r.status === "APPROVED").length,
    pending: allReports.filter((r: any) =>
      ["SUBMITTED", "UNDER_REVIEW"].includes(r.status),
    ).length,
    rejected: allReports.filter((r: any) => r.status === "REJECTED").length,
  };
});

const allSelected = computed(() => {
  return (
    selectableReports.value.length > 0 &&
    selectableReports.value.every((r: any) => selectedReports.value.has(r.id))
  );
});

const someSelected = computed(() => {
  return (
    selectableReports.value.some((r: any) => selectedReports.value.has(r.id)) &&
    !allSelected.value
  );
});

const getFieldValue = (report: any, fieldKey: string) => {
  if (!report.content) return "-";
  const value = report.content[fieldKey];
  if (value === undefined || value === null) return "-";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const getStatusInfo = (status: string) => {
  const info: Record<string, any> = {
    DRAFT: { color: "bg-slate-100 text-slate-700", label: "Draft" },
    SUBMITTED: { color: "bg-purple-100 text-purple-700", label: "Submitted" },
    UNDER_REVIEW: { color: "bg-blue-100 text-blue-700", label: "Under Review" },
    APPROVED: { color: "bg-emerald-100 text-emerald-700", label: "Approved" },
    REJECTED: { color: "bg-red-100 text-red-700", label: "Rejected" },
  };
  return (
    info[status] || { color: "bg-slate-100 text-slate-700", label: status }
  );
};

const toggleRow = (reportId: string) => {
  if (expandedRows.value.has(reportId)) {
    expandedRows.value.delete(reportId);
  } else {
    expandedRows.value.add(reportId);
  }
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectableReports.value.forEach((r: any) =>
      selectedReports.value.delete(r.id),
    );
  } else {
    selectableReports.value.forEach((r: any) =>
      selectedReports.value.add(r.id),
    );
  }
};

const toggleSelect = (reportId: string) => {
  if (selectedReports.value.has(reportId)) {
    selectedReports.value.delete(reportId);
  } else {
    selectedReports.value.add(reportId);
  }
};

const clearSelection = () => {
  selectedReports.value.clear();
};

const bulkApprove = async () => {
  if (selectedReports.value.size === 0) {
    toast.error("No records selected");
    return;
  }

  isApproving.value = true;
  try {
    const result = await $fetch(`/api/${organizationId}/reports/bulk-approve`, {
      method: "POST",
      body: { reportIds: Array.from(selectedReports.value) },
    });
    toast.success(result.message);
    selectedReports.value.clear();
    await refreshReports();
  } catch (error: any) {
    console.error("Failed to approve records:", error);
    toast.error(error.data?.message || "Failed to approve records");
  } finally {
    isApproving.value = false;
  }
};

const bulkReject = async () => {
  if (selectedReports.value.size === 0) {
    toast.error("No records selected");
    return;
  }

  isApproving.value = true;
  try {
    const result = await $fetch(`/api/${organizationId}/reports/bulk-reject`, {
      method: "POST",
      body: { reportIds: Array.from(selectedReports.value) },
    });
    toast.success(result.message);
    selectedReports.value.clear();
    await refreshReports();
  } catch (error: any) {
    console.error("Failed to reject records:", error);
    toast.error(error.data?.message || "Failed to reject records");
  } finally {
    isApproving.value = false;
  }
};

const confirmDeleteReport = (reportId: string) => {
  reportToDelete.value = reportId;
  showDeleteDialog.value = true;
};

const deleteReport = async () => {
  if (!reportToDelete.value) return;

  isDeleting.value = true;
  try {
    await $fetch(`/api/${organizationId}/reports/${reportToDelete.value}`, {
      method: "DELETE",
    });
    toast.success("Report deleted successfully");
    showDeleteDialog.value = false;
    reportToDelete.value = null;
    await refreshReports();
  } catch (error: any) {
    console.error("Failed to delete report:", error);
    toast.error(error.data?.message || "Failed to delete report");
  } finally {
    isDeleting.value = false;
  }
};

const exportToCSV = () => {
  if (filteredReports.value.length === 0) {
    toast.error("No data to export");
    return;
  }

  const headers = [
    "Title",
    "Status",
    "Submitted By",
    "Submitted At",
    ...tableColumns.value.map((c: any) => c.label),
  ];
  const rows = filteredReports.value.map((r: any) => [
    r.title,
    getStatusInfo(r.status).label,
    r.submittedBy?.name || "Unknown",
    formatDate(r.createdAt),
    ...tableColumns.value.map((c: any) => getFieldValue(r, c.key)),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell: any) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${template.value?.name || "template"}-data-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  toast.success("Data exported successfully");
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        @click="navigateTo(`/${organizationId}/reports/templates`)"
      >
        <ArrowLeft class="h-5 w-5" />
      </Button>
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-foreground">
          {{ template?.name || "Template Data" }}
        </h1>
        <p class="text-muted-foreground mt-1">
          View all submitted data for this template
        </p>
      </div>
      <div class="flex items-center gap-3">
        <Button variant="outline" @click="refreshReports">
          <RefreshCw class="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button @click="exportToCSV">
          <Download class="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">
                Total Submissions
              </p>
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
              <CheckCircle class="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Pending Review</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ stats.pending }}
              </p>
            </div>
            <div
              class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center"
            >
              <FileText class="h-5 w-5 text-blue-600" />
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
              <XCircle class="h-5 w-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardContent class="p-6">
        <div class="flex flex-col lg:flex-row gap-4 mb-6">
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search submissions..."
              class="pl-10"
            />
          </div>

          <div class="flex gap-3 flex-wrap">
            <div class="flex items-center gap-2">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <Input
                v-model="dateFrom"
                type="date"
                class="w-[140px]"
                placeholder="From date"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">to</span>
              <Input
                v-model="dateTo"
                type="date"
                class="w-[140px]"
                placeholder="To date"
              />
            </div>

            <Select v-model="selectedStatus">
              <SelectTrigger class="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select v-model="sortBy">
              <SelectTrigger class="w-[140px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          v-if="selectedReports.size > 0"
          class="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4"
        >
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">
              {{ selectedReports.size }} record(s) selected
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Button size="sm" variant="outline" @click="clearSelection">
              Clear
            </Button>
            <Button
              size="sm"
              variant="outline"
              class="text-emerald-600 hover:text-emerald-700"
              @click="bulkApprove"
              :disabled="isApproving"
            >
              <CheckCircle class="h-4 w-4 mr-1" />
              Approve All
            </Button>
            <Button
              size="sm"
              variant="outline"
              class="text-red-600 hover:text-red-700"
              @click="bulkReject"
              :disabled="isApproving"
            >
              <XCircle class="h-4 w-4 mr-1" />
              Reject All
            </Button>
          </div>
        </div>

        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <RefreshCw class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>

        <div v-else-if="filteredReports.length === 0" class="text-center py-12">
          <FileText class="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 class="text-lg font-semibold mb-2">No submissions found</h3>
          <p class="text-muted-foreground mb-4">
            {{
              searchQuery || dateFrom || dateTo
                ? "Try adjusting your search or filters."
                : "No reports have been submitted for this template yet."
            }}
          </p>
          <Button
            @click="navigateTo(`/${organizationId}/reports/fill/${templateId}`)"
          >
            Submit New Report
          </Button>
        </div>

        <div v-else class="space-y-4">
          <div class="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow class="bg-muted/50">
                  <TableHead class="w-10">
                    <Checkbox
                      :checked="allSelected"
                      :indeterminate="someSelected"
                      @update:model-value="toggleSelectAll"
                    />
                  </TableHead>
                  <TableHead class="w-10"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead v-for="column in tableColumns" :key="column.key">
                    {{ column.label }}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-for="report in filteredReports" :key="report.id">
                  <TableRow
                    :class="{
                      'bg-primary/5': selectedReports.has(report.id),
                    }"
                  >
                    <TableCell
                      v-if="
                        ['SUBMITTED', 'UNDER_REVIEW'].includes(report.status)
                      "
                    >
                      <Checkbox
                        :checked="selectedReports.has(report.id)"
                        @update:model-value="toggleSelect(report.id)"
                      />
                    </TableCell>
                    <TableCell v-else></TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        class="h-8 w-8"
                        @click="toggleRow(report.id)"
                      >
                        <ChevronDown
                          v-if="expandedRows.has(report.id)"
                          class="h-4 w-4"
                        />
                        <ChevronUp v-else class="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div class="font-medium">{{ report.title }}</div>
                    </TableCell>
                    <TableCell v-for="column in tableColumns" :key="column.key">
                      <div
                        class="max-w-[200px] truncate"
                        :title="getFieldValue(report, column.key)"
                      >
                        {{ getFieldValue(report, column.key) }}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge :class="getStatusInfo(report.status).color">
                        {{ getStatusInfo(report.status).label }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div class="flex items-center gap-2">
                        <User class="h-4 w-4 text-muted-foreground" />
                        <span>{{ report.submittedBy || "Unknown" }}</span>
                      </div>
                    </TableCell>
                    <TableCell>{{ formatDate(report.createdAt) }}</TableCell>
                    <TableCell class="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        @click="
                          navigateTo(
                            `/${organizationId}/reports/view/${report.id}`,
                          )
                        "
                      >
                        <Eye class="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        class="text-red-600 hover:text-red-700 hover:bg-red-50"
                        @click="confirmDeleteReport(report.id)"
                        :disabled="isDeleting"
                      >
                        <Trash2 v-if="!isDeleting" class="h-4 w-4" />
                        <RefreshCw v-else class="h-4 w-4 animate-spin" />
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow v-if="expandedRows.has(report.id)">
                    <TableCell
                      :colspan="tableColumns.length + 7"
                      class="bg-muted/30"
                    >
                      <div class="p-4">
                        <h4 class="font-medium mb-3">Detailed View</h4>
                        <div class="grid gap-4">
                          <div
                            v-for="column in tableColumns"
                            :key="column.key"
                            class="grid grid-cols-3 gap-4"
                          >
                            <span
                              class="text-sm font-medium text-muted-foreground"
                              >{{ column.label }}:</span
                            >
                            <span class="col-span-2">{{
                              getFieldValue(report, column.key)
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </template>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>

    <Dialog v-model:open="showDeleteDialog">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Report</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this report? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="showDeleteDialog = false">
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="deleteReport"
            :disabled="isDeleting"
          >
            <RefreshCw v-if="isDeleting" class="h-4 w-4 mr-2 animate-spin" />
            <Trash2 v-else class="h-4 w-4 mr-2" />
            {{ isDeleting ? "Deleting..." : "Delete" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
