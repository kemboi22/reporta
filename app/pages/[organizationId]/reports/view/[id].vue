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
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  Sparkles,
} from "lucide-vue-next";

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

const notes = ref("");

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    SUBMITTED: "bg-purple-50 text-purple-700 border-purple-200",
    UNDER_REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
  };
  return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
};

const getStatusIcon = (status: string) => {
  const icons: Record<string, any> = {
    DRAFT: FileText,
    IN_PROGRESS: Clock,
    SUBMITTED: Sparkles,
    UNDER_REVIEW: AlertCircle,
    APPROVED: CheckCircle2,
    REJECTED: AlertCircle,
  };
  return icons[status] || FileText;
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const printReport = () => window.print();

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

const saveNotes = async () => {
  try {
    await $fetch(`/api/${organizationId}/reports/${reportId}`, {
      method: "PUT",
      body: { notes: notes.value },
    });
    refresh();
  } catch (error) {
    console.error("Failed to save notes:", error);
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
  return fieldLabels.value[key] || key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, ' ')
    .trim();
};

const formatFieldValue = (value: any) => {
  if (value === null || value === undefined) return '';
  
  if (typeof value === 'string') {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const trimmed = value.trim();
    
    if (uuidPattern.test(trimmed)) {
      return 'Not specified';
    }
    
    if (uuidPattern.test(trimmed.split('\n')[0])) {
      const parts = trimmed.split('\n');
      parts.shift();
      return parts.join('\n').trim() || 'Not specified';
    }
  }
  
  if (Array.isArray(value)) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (value.length > 0 && uuidPattern.test(String(value[0]).trim())) {
      return value.slice(1).join('\n') || 'Not specified';
    }
    return value.join('\n');
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  
  return String(value);
};
</script>

<template>
  <div v-if="pending" class="flex items-center justify-center h-[60vh]">
    <div
      class="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"
    ></div>
  </div>

  <div v-else-if="report" class="space-y-6">
    <div
      class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/10"
    >
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"
      ></div>

      <div class="relative p-6 md:p-8">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            @click="navigateTo(`/${organizationId}/reports/submitted`)"
            class="rounded-full hover:bg-primary/10 h-10 w-10"
          >
            <ArrowLeft class="h-5 w-5" />
          </Button>

          <div class="flex-1 space-y-3">
            <div class="flex items-center gap-3">
              <div
                class="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20"
              >
                <FileText class="h-6 w-6 text-white" />
              </div>
              <div>
                <h1
                  class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                >
                  {{ report.title }}
                </h1>
                <div class="flex flex-wrap items-center gap-3 mt-2">
                  <Badge
                    :class="getStatusColor(report.status)"
                    class="font-medium border shadow-sm flex items-center gap-1.5"
                  >
                    <component
                      :is="getStatusIcon(report.status)"
                      class="h-3.5 w-3.5"
                    />
                    {{ getStatusLabel(report.status) }}
                  </Badge>
                  <span
                    class="text-sm text-muted-foreground/80 flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50"
                  >
                    <Calendar class="w-4 h-4" />
                    {{ formatDate(report.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <Button
              variant="outline"
              @click="printReport"
              class="shadow-sm hover:shadow-md transition-shadow"
            >
              <Printer class="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              @click="deleteReport"
              class="text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 shadow-sm transition-all"
            >
              <Trash2 class="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-4 gap-6">
      <div class="lg:col-span-3 space-y-6">
        <Card
          class="border-2 border-primary/10 shadow-xl shadow-primary/5 overflow-hidden"
        >
          <div
            class="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/10 px-6 py-4"
          >
            <div class="flex items-center justify-between">
              <CardTitle class="flex items-center gap-2 text-lg">
                <FileText class="h-5 w-5 text-primary" />
                Report Content
              </CardTitle>
              <Badge
                v-if="report.template"
                variant="outline"
                class="text-xs bg-primary/5 border-primary/20"
              >
                <FolderOpen class="h-3 w-3 mr-1" />
                {{ report.template.name }}
              </Badge>
            </div>
          </div>
          <CardContent class="p-6">
            <div
              v-if="!report.content || Object.keys(report.content).length === 0"
              class="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/30"
            >
              <div class="p-4 rounded-full bg-primary/5 mb-4">
                <Info class="h-10 w-10 text-muted-foreground/50" />
              </div>
              <p class="text-muted-foreground font-semibold text-lg">
                No content filled
              </p>
              <p class="text-sm text-muted-foreground/70 mt-1">
                This report has no data yet
              </p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(value, key) in report.content"
                :key="key"
                class="group relative"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <div class="relative">
                  <div
                    class="text-xs font-semibold text-primary/80 uppercase tracking-widest mb-2 flex items-center gap-2"
                  >
                    <div
                      class="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent"
                    ></div>
                    {{ formatFieldLabel(key) }}
                    <div
                      class="h-px flex-1 bg-gradient-to-l from-primary/20 to-transparent"
                    ></div>
                  </div>
                  <div
                    class="p-5 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border border-muted/200 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/5 transition-all duration-300"
                  >
                    <p
                      class="text-foreground leading-relaxed whitespace-pre-wrap"
                    >
                      {{ formatFieldValue(value) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-2 border-muted/20 shadow-lg">
          <CardHeader
            class="bg-gradient-to-r from-muted/30 to-transparent border-b border-muted/20"
          >
            <CardTitle class="flex items-center gap-2">
              <Sparkles class="h-5 w-5 text-primary" />
              Notes & Comments
            </CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <Textarea
              v-model="notes"
              placeholder="Add notes or comments about this report..."
              rows="5"
              class="resize-none bg-muted/30 border-muted/200 focus:ring-2 focus:ring-primary/20"
            />
            <div class="flex justify-end mt-4">
              <Button
                @click="saveNotes"
                class="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Save Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-4">
        <Card class="border-2 border-primary/10 shadow-lg shadow-primary/5">
          <CardHeader
            class="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/10 px-5 py-4"
          >
            <CardTitle class="text-base font-semibold"
              >Report Details</CardTitle
            >
          </CardHeader>
          <CardContent class="p-5 space-y-5">
            <div class="flex items-center justify-between">
              <div class="text-xs text-muted-foreground font-medium">
                Status
              </div>
              <Badge
                :class="getStatusColor(report.status)"
                class="font-medium border shadow-sm"
              >
                {{ getStatusLabel(report.status) }}
              </Badge>
            </div>

            <Separator
              class="bg-gradient-to-r from-transparent via-muted to-transparent"
            />

            <div class="space-y-1">
              <div
                class="text-xs text-muted-foreground font-medium flex items-center gap-1.5"
              >
                <Calendar class="w-3.5 h-3.5" />
                Created
              </div>
              <div class="text-sm font-semibold">
                {{ formatDate(report.createdAt) }}
              </div>
            </div>

            <div v-if="report.updatedAt" class="space-y-1">
              <div
                class="text-xs text-muted-foreground font-medium flex items-center gap-1.5"
              >
                <Clock class="w-3.5 h-3.5" />
                Last Updated
              </div>
              <div class="text-sm font-semibold">
                {{ formatDate(report.updatedAt) }}
              </div>
            </div>

            <div v-if="report.submittedAt" class="space-y-1">
              <div
                class="text-xs text-muted-foreground font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 class="w-3.5 h-3.5" />
                Submitted
              </div>
              <div class="text-sm font-semibold">
                {{ formatDate(report.submittedAt) }}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-2 border-muted/20 shadow-md">
          <CardHeader
            class="bg-gradient-to-r from-muted/20 to-transparent border-b border-muted/20 px-5 py-4"
          >
            <CardTitle class="text-base font-semibold">Submitted By</CardTitle>
          </CardHeader>
          <CardContent class="p-5">
            <div class="flex items-center gap-4">
              <div
                class="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20"
              >
                <User class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm truncate">
                  {{ report.submittedBy || "Unknown" }}
                </p>
                <p class="text-xs text-muted-foreground">Team Member</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-2 border-muted/20 shadow-md">
          <CardHeader
            class="bg-gradient-to-r from-muted/20 to-transparent border-b border-muted/20 px-5 py-4"
          >
            <CardTitle class="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent class="p-3 space-y-2">
            <Button
              variant="outline"
              class="w-full justify-start hover:bg-primary/5 hover:border-primary/20"
              @click="printReport"
            >
              <Download class="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              class="w-full justify-start hover:bg-primary/5 hover:border-primary/20"
              @click="navigateTo(`/${organizationId}/reports/submitted`)"
            >
              <ArrowLeft class="h-4 w-4 mr-2" />
              Back to Reports
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
