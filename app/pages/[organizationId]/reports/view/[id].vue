<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Printer, Edit, Trash2, Eye, FileText, Calendar, User, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const reportId = route.params.id as string;

const { data: report, pending, refresh } = await useLazyFetch(
  `/api/${organizationId}/reports/${reportId}`,
  {
    key: `report-${reportId}`,
  },
);

const { data: template } = await useLazyFetch(
  () => report.value?.templateId ? `/api/${organizationId}/templates/${report.value.templateId}` : null,
  {
    key: () => `template-${report.value?.templateId}`,
  },
);

const formData = ref({
  title: "",
  notes: "",
});

const sections = computed(() => {
  if (!template.value?.fields) return [];
  return (template.value.fields as any).sections || [];
});

const downloadReport = () => {
  window.print();
};

const deleteReport = async () => {
  if (!confirm("Are you sure you want to delete this report?")) return;

  try {
    await $fetch(`/api/${organizationId}/reports/${reportId}`, {
      method: "DELETE",
    });
    navigateTo(`/${organizationId}/reports/submitted`);
  } catch (error) {
    console.error("Failed to delete report:", error);
  }
};

const updateReport = async (updates: any) => {
  try {
    await $fetch(`/api/${organizationId}/reports/${reportId}`, {
      method: "PUT",
      body: updates,
    });
    refresh();
  } catch (error) {
    console.error("Failed to update report:", error);
  }
};

const getStatusInfo = (status: string) => {
  const info: Record<string, any> = {
    DRAFT: { color: "bg-gray-100 text-gray-700 hover:bg-gray-100", icon: Clock, label: "Draft" },
    IN_PROGRESS: { color: "bg-blue-100 text-blue-700 hover:bg-blue-100", icon: Clock, label: "In Progress" },
    SUBMITTED: { color: "bg-purple-100 text-purple-700 hover:bg-purple-100", icon: FileText, label: "Submitted" },
    APPROVED: { color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100", icon: CheckCircle2, label: "Approved" },
    REJECTED: { color: "bg-red-100 text-red-700 hover:bg-red-100", icon: AlertCircle, label: "Rejected" },
  };
  return info[status] || { color: "bg-gray-100 text-gray-700", icon: FileText, label: status };
};
</script>

<template>
  <div v-if="pending" class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>

  <div v-else-if="report" class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-start gap-4">
        <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText class="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-foreground">{{ report.title }}</h1>
          <div class="flex items-center gap-3 mt-2">
            <Badge :class="getStatusInfo(report.status).color">
              <component :is="getStatusInfo(report.status).icon" class="w-3 h-3 mr-1" />
              {{ getStatusInfo(report.status).label }}
            </Badge>
            <span class="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar class="w-4 h-4" />
              {{ new Date(report.createdAt).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="downloadReport">
          <Printer class="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" @click="deleteReport" class="text-destructive hover:text-destructive">
          <Trash2 class="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <FileText class="w-5 h-5" />
              Report Content
            </CardTitle>
            <CardDescription>View all submitted information</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="sections.length === 0" class="border-2 border-dashed rounded-lg py-12 text-center">
              <FileText class="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p class="text-muted-foreground">No template structure available</p>
            </div>

            <div v-else class="space-y-6">
              <div v-for="(section, sIndex) in sections" :key="section.id" class="space-y-4">
                <div v-if="section.title" class="border-b pb-2">
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                      {{ sIndex + 1 }}
                    </span>
                    {{ section.title }}
                  </h3>
                </div>

                <div v-if="section.fields.length === 0" class="text-center py-4 text-sm text-muted-foreground border border-dashed rounded">
                  No fields in this section
                </div>

                <div v-else class="space-y-4">
                  <div v-for="field in section.fields" :key="field.id" class="space-y-2">
                    <Label class="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      {{ field.label }}
                      <Badge v-if="field.required" variant="destructive" class="h-4 px-1.5 py-0 text-xs">Required</Badge>
                    </Label>
                    <div class="rounded-md border bg-muted/30 p-4">
                      <p v-if="report.content && report.content[field.id]" class="text-foreground">
                        {{ report.content[field.id] }}
                      </p>
                      <p v-else class="text-muted-foreground italic">Not filled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <ChevronRight class="w-5 h-5" />
              Notes & Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              v-model="formData.notes" 
              placeholder="Add notes or comments about this report..." 
              rows="4" 
              class="resize-none"
            />
            <Button @click="updateReport({ notes: formData.notes })" class="mt-3" size="sm">
              Save Notes
            </Button>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Report Details</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <Label class="text-sm text-muted-foreground">Template</Label>
              <p class="font-medium mt-1">{{ template?.name || "Unknown Template" }}</p>
            </div>
            <div>
              <Label class="text-sm text-muted-foreground">Status</Label>
              <div class="mt-1">
                <Select :model-value="report.status" @update:model-value="(val) => updateReport({ status: val })">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div class="pt-4 border-t space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Created</span>
                <span class="font-medium">{{ new Date(report.createdAt).toLocaleDateString() }}</span>
              </div>
              <div v-if="report.updatedAt" class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Updated</span>
                <span class="font-medium">{{ new Date(report.updatedAt).toLocaleDateString() }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card v-if="report.submittedBy">
          <CardHeader>
            <CardTitle class="text-lg">Submitted By</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User class="h-5 w-5 text-primary" />
              </div>
              <div>
                <p class="font-medium">{{ report.submittedBy.name || "Unknown" }}</p>
                <p class="text-sm text-muted-foreground">{{ report.submittedBy.email || "" }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <Button variant="outline" class="w-full justify-start" @click="navigateTo(`/${organizationId}/reports/submitted`)">
              <ChevronRight class="w-4 h-4 mr-2" />
              Back to Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
