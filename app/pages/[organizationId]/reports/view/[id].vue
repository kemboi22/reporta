<script setup lang="ts">
import { ref, computed } from "vue";
import {
  FileText,
  Calendar,
  User,
  ArrowLeft,
  Printer,
  Trash2,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  Sparkles,
  MessageSquare,
  Eye,
  EyeOff,
  XCircle,
  Check,
  MoreVertical,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "~/lib/auth";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const reportId = route.params.id as string;

const {
  data: report,
  pending,
  refresh,
} = await useLazyFetch(`/api/${organizationId}/reports/${reportId}`);

const newComment = ref("");
const showComments = ref(true);
const rejectReason = ref("");
const isApproving = ref(false);
const isRejecting = ref(false);

const session = authClient.useSession();

const canApproveOrReject = computed(() => {
  return (
    report.value && ["SUBMITTED", "UNDER_REVIEW"].includes(report.value.status)
  );
});

const comments = computed(() => report.value?.comments || []);

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    DRAFT:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    IN_PROGRESS:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    SUBMITTED:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    UNDER_REVIEW:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    APPROVED:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    REJECTED:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  };
  return (
    colors[status] ||
    "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
  );
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    DRAFT: "Draft",
    IN_PROGRESS: "In Progress",
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };
  return labels[status] || status;
};

const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateTime = (dateString: string | Date | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const printReport = () => window.print();

const exportToCSV = () => {
  if (!report.value) return;

  const rows: string[][] = [];
  rows.push(["Field", "Value"]);
  rows.push(["Title", report.value.title || ""]);
  rows.push(["Status", getStatusLabel(report.value.status) || ""]);
  rows.push(["Submitted By", report.value.submittedBy || ""]);
  rows.push(["Created At", formatDate(report.value.createdAt) || ""]);
  rows.push(["Updated At", formatDate(report.value.updatedAt) || ""]);
  rows.push(["Submitted At", formatDate(report.value.submittedAt) || ""]);

  if (report.value.content) {
    for (const [key, value] of Object.entries(report.value.content)) {
      const label = formatFieldLabel(key);
      const val =
        typeof value === "object" ? JSON.stringify(value) : String(value || "");
      rows.push([label, val]);
    }
  }

  if (report.value.template) {
    rows.push(["Template", report.value.template.name || ""]);
    rows.push(["Department", report.value.template.department || ""]);
  }

  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const escaped = String(cell).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${report.value.title || "report"}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);

  toast.success("Report exported to CSV");
};

const exportToPDF = () => {
  window.print();
};

const deleteReport = async () => {
  if (
    !confirm(
      "Are you sure you want to delete this report? This action cannot be undone.",
    )
  )
    return;

  try {
    await $fetch(`/api/${organizationId}/reports/${reportId}`, {
      method: "DELETE",
    });
    navigateTo(`/${organizationId}/reports/submitted`);
  } catch (error) {
    console.error("Failed to delete report:", error);
  }
};

const addComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    await $fetch(`/api/${organizationId}/reports/${reportId}/comments`, {
      method: "POST",
      body: { content: newComment.value },
    });
    newComment.value = "";
    refresh();
  } catch (error) {
    console.error("Failed to add comment:", error);
    toast.error("Failed to add comment");
  }
};

const approveReport = async () => {
  isApproving.value = true;
  try {
    await $fetch(`/api/${organizationId}/reports/${reportId}/approve`, {
      method: "POST",
      body: { reviewedBy: session.value.data?.user.id },
    });
    toast.success("Report approved successfully");
    refresh();
  } catch (error) {
    console.error("Failed to approve report:", error);
    toast.error("Failed to approve report");
  } finally {
    isApproving.value = false;
  }
};

const rejectReport = async () => {
  if (!session.value?.user?.id) {
    toast.error("You must be logged in to reject reports");
    return;
  }

  isRejecting.value = true;
  try {
    await $fetch(`/api/${organizationId}/reports/${reportId}/reject`, {
      method: "POST",
      body: {
        reviewedBy: session.value.data?.user.id,
        reason: rejectReason.value,
      },
    });
    toast.success("Report rejected successfully");
    rejectReason.value = "";
    refresh();
  } catch (error) {
    console.error("Failed to reject report:", error);
    toast.error("Failed to reject report");
  } finally {
    isRejecting.value = false;
  }
};

const fieldLabels = computed(() => {
  const labels: Record<string, string> = {};

  if (report.value?.template?.fields?.sections) {
    for (const section of report.value.template.fields.sections) {
      if (section.fields && Array.isArray(section.fields)) {
        for (const field of section.fields) {
          if (field.id && field.label) {
            labels[field.id] = field.label;
          }
        }
      }
    }
  }

  return labels;
});

const formatFieldLabel = (key: string) => {
  return (
    fieldLabels.value[key] ||
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/_/g, " ")
      .trim()
  );
};

const getFieldIcon = (key: string, value: any) => {
  if (typeof value === "boolean") {
    return value ? CheckCircle2 : AlertCircle;
  }
  return null;
};
</script>

<template>
  <div v-if="pending" class="flex items-center justify-center h-[60vh]">
    <div
      class="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"
    ></div>
  </div>

  <div v-else-if="report" class="space-y-6 max-w-[1400px] mx-auto">
    <!-- Header -->
    <div class="bg-background border-b border-border pb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            @click="navigateTo(`/${organizationId}/reports/submitted`)"
            class="rounded-lg hover:bg-muted"
          >
            <ArrowLeft class="h-5 w-5" />
          </Button>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">
              {{ report.title }}
            </h1>
            <p class="text-sm text-muted-foreground mt-1">
              Submitted on
              {{ formatDate(report.submittedAt || report.createdAt) }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Button
            v-if="canApproveOrReject"
            variant="outline"
            size="sm"
            class="gap-2"
            @click="navigateTo(`/${organizationId}/reports/submitted`)"
          >
            <ArrowLeft class="h-4 w-4" />
            Back
          </Button>
          <Button
            v-if="canApproveOrReject"
            variant="default"
            size="sm"
            class="gap-2 bg-emerald-600 hover:bg-emerald-700"
            @click="approveReport"
            :disabled="isApproving"
          >
            <CheckCircle2 class="h-4 w-4" />
            {{ isApproving ? "Approving..." : "Approve" }}
          </Button>
          <AlertDialog v-if="canApproveOrReject">
            <AlertDialogTrigger as-child>
              <Button variant="destructive" size="sm" class="gap-2">
                <XCircle class="h-4 w-4" />
                Reject
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Report</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reject this report? This action can
                  be undone by re-submitting the report.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div class="py-4">
                <Textarea
                  v-model="rejectReason"
                  placeholder="Reason for rejection (optional)..."
                  rows="3"
                  class="resize-none"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  @click="rejectReport"
                  :disabled="isRejecting || !rejectReason.trim()"
                  class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {{ isRejecting ? "Rejecting..." : "Reject Report" }}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            v-else
            variant="outline"
            size="sm"
            class="gap-2"
            @click="navigateTo(`/${organizationId}/reports/submitted`)"
          >
            <ArrowLeft class="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="gap-2"
            @click="exportToCSV"
          >
            <Download class="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="gap-2"
            @click="exportToPDF"
          >
            <Download class="h-4 w-4" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="gap-2"
            @click="printReport"
          >
            <Printer class="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Report Details Card -->
        <Card class="shadow-sm">
          <CardHeader class="border-b bg-muted/30">
            <div class="flex items-center justify-between">
              <CardTitle class="text-lg font-semibold"
                >Report Details</CardTitle
              >
              <Badge
                :class="getStatusColor(report.status)"
                class="font-medium border"
              >
                {{ getStatusLabel(report.status) }}
              </Badge>
            </div>
            <p class="text-sm text-muted-foreground mt-1">
              Complete submission data
            </p>
          </CardHeader>
          <CardContent class="p-0">
            <div class="divide-y divide-border">
              <div
                v-for="(value, key) in fieldLabels"
                :key="key"
                class="grid grid-cols-3 gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div class="text-sm font-medium text-muted-foreground">
                  {{ value }}
                </div>
                <div
                  class="col-span-2 text-sm text-foreground flex items-start gap-2"
                >
                  <span class="whitespace-pre-wrap wrap-break-word">
                    {{ report.content[key] }}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Comments Section -->
        <Card class="shadow-sm">
          <CardHeader class="border-b bg-muted/30">
            <div class="flex items-center justify-between">
              <CardTitle class="text-lg font-semibold flex items-center gap-2">
                <MessageSquare class="h-5 w-5" />
                Comments & Notes ({{ comments.length }})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                @click="showComments = !showComments"
              >
                <component :is="showComments ? EyeOff : Eye" class="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent v-if="showComments" class="p-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Add Comment</label>
                <Textarea
                  v-model="newComment"
                  placeholder="Add a comment or note..."
                  rows="3"
                  class="resize-none"
                />
                <div class="flex justify-end">
                  <Button
                    @click="addComment"
                    size="sm"
                    :disabled="!newComment.trim()"
                  >
                    Add Comment
                  </Button>
                </div>
              </div>

              <div class="pt-4">
                <div
                  v-if="comments.length === 0"
                  class="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div class="p-4 rounded-full bg-muted mb-4">
                    <MessageSquare class="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p class="text-sm font-medium text-foreground">
                    No comments yet
                  </p>
                  <p class="text-xs text-muted-foreground mt-1">
                    Be the first to add a comment
                  </p>
                </div>
                <div v-else class="space-y-4">
                  <Card
                    v-for="comment in comments"
                    :key="comment.id"
                    class="border-border"
                  >
                    <CardContent class="p-6">
                      <div class="flex items-start gap-4">
                        <Avatar class="h-10 w-10">
                          <AvatarImage :src="comment.user?.image" />
                          <AvatarFallback>{{
                            getInitials(comment.user?.name || "")
                          }}</AvatarFallback>
                        </Avatar>
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-2">
                            <h4 class="font-semibold">
                              {{ comment.user?.name || "Unknown User" }}
                            </h4>
                            <span class="text-sm text-muted-foreground">
                              {{ formatDateTime(comment.createdAt) }}
                            </span>
                          </div>
                          <p class="text-sm text-foreground">
                            {{ comment.content }}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Submitted By -->
        <Card class="shadow-sm">
          <CardHeader class="border-b bg-muted/30 pb-3">
            <CardTitle class="text-base font-semibold">Submitted By</CardTitle>
          </CardHeader>
          <CardContent class="p-4">
            <div class="flex items-center gap-3">
              <div
                class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold"
              >
                {{ (report.submittedBy || "U")[0].toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm truncate">
                  {{ report.submittedBy || "Unknown User" }}
                </p>
                <p class="text-xs text-muted-foreground">Team Member</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Approval Details -->
        <Card
          v-if="report.status === 'APPROVED' || report.status === 'REJECTED'"
          class="shadow-sm"
        >
          <CardHeader class="border-b bg-muted/30 pb-3">
            <CardTitle class="text-base font-semibold"
              >Approval Details</CardTitle
            >
          </CardHeader>
          <CardContent class="p-4 space-y-3">
            <div class="flex items-start gap-2">
              <component
                :is="report.status === 'APPROVED' ? CheckCircle2 : XCircle"
                :class="[
                  'h-4 w-4 mt-0.5 flex-shrink-0',
                  report.status === 'APPROVED'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400',
                ]"
              />
              <div class="flex-1">
                <p class="text-sm font-medium">
                  {{ report.status === "APPROVED" ? "Approved" : "Rejected" }}
                </p>
              </div>
            </div>
            <div class="text-xs text-muted-foreground space-y-1">
              <p>By: {{ report.reviewedBy || "Unknown" }}</p>
              <p>On: {{ formatDate(report.reviewedAt || report.updatedAt) }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Template Info -->
        <Card v-if="report.template" class="shadow-sm">
          <CardHeader class="border-b bg-muted/30 pb-3">
            <CardTitle class="text-base font-semibold">Template Info</CardTitle>
          </CardHeader>
          <CardContent class="p-4 space-y-3">
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Template:</span>
                <span class="font-medium">{{ report.template.name }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Department:</span>
                <Badge variant="secondary" class="text-xs">
                  {{ report.template.department || "General" }}
                </Badge>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Total Fields:</span>
                <span class="font-medium">
                  {{ Object.keys(report.content || {}).length }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Timestamps -->
        <Card class="shadow-sm">
          <CardHeader class="border-b bg-muted/30 pb-3">
            <CardTitle class="text-base font-semibold">Timeline</CardTitle>
          </CardHeader>
          <CardContent class="p-4 space-y-3">
            <div class="flex items-start gap-3">
              <Clock class="h-4 w-4 text-muted-foreground mt-0.5" />
              <div class="flex-1 text-sm">
                <p class="font-medium">Created</p>
                <p class="text-muted-foreground text-xs">
                  {{ formatDate(report.createdAt) }}
                </p>
              </div>
            </div>
            <div v-if="report.updatedAt" class="flex items-start gap-3">
              <Clock class="h-4 w-4 text-muted-foreground mt-0.5" />
              <div class="flex-1 text-sm">
                <p class="font-medium">Last Updated</p>
                <p class="text-muted-foreground text-xs">
                  {{ formatDate(report.updatedAt) }}
                </p>
              </div>
            </div>
            <div v-if="report.submittedAt" class="flex items-start gap-3">
              <CheckCircle2
                class="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5"
              />
              <div class="flex-1 text-sm">
                <p class="font-medium">Submitted</p>
                <p class="text-muted-foreground text-xs">
                  {{ formatDate(report.submittedAt) }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Actions -->
        <Card class="shadow-sm">
          <CardContent class="p-3 space-y-2">
            <Button
              variant="outline"
              class="w-full justify-start"
              @click="exportToPDF"
            >
              <Download class="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              class="w-full justify-start"
              @click="exportToCSV"
            >
              <Download class="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Button
              variant="outline"
              class="w-full justify-start text-destructive hover:text-destructive"
              @click="deleteReport"
            >
              <Trash2 class="h-4 w-4 mr-2" />
              Delete Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
