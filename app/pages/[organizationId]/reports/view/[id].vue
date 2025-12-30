<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Calendar, User, ArrowLeft, Printer, Trash2, Download, Info } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const reportId = route.params.id as string;

const { data: report, pending, refresh } = await useLazyFetch(`/api/${organizationId}/reports/${reportId}`);

const notes = ref("");

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    SUBMITTED: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    UNDER_REVIEW: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    APPROVED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    REJECTED: "bg-red-100 text-red-700 hover:bg-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
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
  if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) return;

  try {
    await $fetch(`/api/${organizationId}/reports/${reportId}`, { method: "DELETE" });
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
</script>

<template>
  <div v-if="pending" class="flex items-center justify-center h-[60vh]">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>

  <div v-else-if="report" class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="navigateTo(`/${organizationId}/reports/submitted`)" class="rounded-full">
        <ArrowLeft class="h-5 w-5" />
      </Button>
      <div class="flex-1">
        <h1 class="text-3xl font-bold">{{ report.title }}</h1>
        <div class="flex items-center gap-3 mt-2">
          <Badge :class="getStatusColor(report.status)" class="font-medium">
            {{ getStatusLabel(report.status) }}
          </Badge>
          <span class="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar class="w-4 h-4" />
            {{ formatDate(report.createdAt) }}
          </span>
        </div>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="printReport">
          <Printer class="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" @click="deleteReport" class="text-destructive">
          <Trash2 class="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>

    <div class="grid lg:grid-cols-4 gap-6">
      <div class="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle class="flex items-center gap-2">
                <FileText class="h-5 w-5 text-primary" />
                Report Content
              </CardTitle>
              <Badge v-if="report.template" variant="outline" class="text-xs">
                {{ report.template.name }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div v-if="!report.content || Object.keys(report.content).length === 0" class="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
              <Info class="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p class="text-muted-foreground font-medium">No content filled</p>
              <p class="text-sm text-muted-foreground mt-1">This report has no data yet</p>
            </div>

            <div v-else class="space-y-3">
              <div v-for="(value, key) in report.content" :key="key" class="group">
                <div class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  {{ key }}
                </div>
                <div class="p-4 bg-muted/50 rounded-lg border group-hover:border-primary/50 transition-colors">
                  <p class="text-foreground whitespace-pre-wrap">{{ value }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes & Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              v-model="notes" 
              placeholder="Add notes or comments about this report..." 
              rows="5" 
              class="resize-none"
            />
            <div class="flex justify-end mt-4">
              <Button @click="saveNotes">
                Save Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Report Details</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <div class="text-xs text-muted-foreground mb-1">Status</div>
              <Badge :class="getStatusColor(report.status)" class="font-medium">
                {{ getStatusLabel(report.status) }}
              </Badge>
            </div>

            <Separator />

            <div>
              <div class="text-xs text-muted-foreground mb-1">Created</div>
              <div class="text-sm font-medium">{{ formatDate(report.createdAt) }}</div>
            </div>

            <div v-if="report.updatedAt">
              <div class="text-xs text-muted-foreground mb-1">Last Updated</div>
              <div class="text-sm font-medium">{{ formatDate(report.updatedAt) }}</div>
            </div>

            <div v-if="report.submittedAt">
              <div class="text-xs text-muted-foreground mb-1">Submitted</div>
              <div class="text-sm font-medium">{{ formatDate(report.submittedAt) }}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-base">Submitted By</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User class="h-5 w-5 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm truncate">{{ report.submittedBy || "Unknown" }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <Button variant="outline" class="w-full justify-start" @click="printReport">
              <Download class="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" class="w-full justify-start" @click="navigateTo(`/${organizationId}/reports/submitted`)">
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
