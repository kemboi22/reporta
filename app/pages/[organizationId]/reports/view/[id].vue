<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Download, Printer, Edit, Trash2, Eye } from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const reportId = route.params.id as string;

const { data: report, pending } = await useLazyFetch(`/api/${organizationId}/reports/${reportId}`, {
  key: `report-${reportId}`,
});

const { data: templates } = await useLazyFetch(`/api/${organizationId}/templates`, {
  key: `templates-${organizationId}`,
  transform: (data) => data || [],
});

const { data: staff } = await useLazyFetch(`/api/${organizationId}/staff`, {
  key: `staff-${organizationId}`,
  transform: (data) => data || [],
});

const formData = ref({
  title: "",
  answers: {},
  notes: "",
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

const saveReport = async () => {
  try {
    await $fetch(`/api/${organizationId}/reports/${reportId}`, {
      method: "PUT",
      body: formData.value,
    });
    refreshNuxtData();
  } catch (error) {
    console.error("Failed to save report:", error);
  }
};
</script>

<template>
  <div v-if="pending">
    <p class="text-center py-12">Loading...</p>
  </div>

  <div v-else-if="report" class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <div>
          <h1 class="text-3xl font-bold text-foreground">{{ report.title }}</h1>
          <Badge>{{ report.status }}</Badge>
        </div>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="downloadReport">
          <Download class="h-4 w-4 mr-2" />
          View
        </Button>
        <Button variant="outline" @click="downloadReport">
          <Printer class="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <div>
                <Label>Report Title</Label>
                <Input v-model="formData.title" :value="report.title" disabled />
              </div>
              <div>
                <Label>Template</Label>
                <Select v-model="formData.templateId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select Template</SelectItem>
                    <SelectItem
                      v-for="template in templates"
                      :key="template.id"
                      :value="template.id"
                    >
                      {{ template.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select v-model="formData.status">
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p class="text-center py-8 text-muted-foreground">
                Report answers will be displayed here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Report Info</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-sm text-muted-foreground">Template: {{ report.template?.name || "Custom Report" }}</p>
            <p class="text-sm text-muted-foreground">Created: {{ new Date(report.createdAt).toLocaleDateString() }}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
