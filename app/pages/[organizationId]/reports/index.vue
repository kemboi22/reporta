<script setup lang="ts">
import {
  Search,
  FileText,
  Table as TableIcon,
  LayoutGrid,
  List as ListIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  ChevronRight,
  FileStack,
  Filter,
} from "lucide-vue-next";
import { NuxtLink } from "#components";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const searchQuery = ref("");
const selectedStatus = ref("all");
const viewMode = ref<"grid" | "list">("grid");

const { data: templates } = await useLazyFetch(
  `/api/${organizationId}/templates`,
  {
    key: `reports-templates-${organizationId}`,
  },
);

const { data: reports } = await useLazyFetch(`/api/${organizationId}/reports`, {
  key: `reports-count-${organizationId}`,
});

const filteredTemplates = computed(() => {
  let filtered = Array.isArray(templates.value) ? templates.value : (templates.value?.data || []);

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (t: any) =>
        t.name?.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query),
    );
  }

  if (selectedStatus.value !== "all") {
    const isActive = selectedStatus.value === "active";
    filtered = filtered.filter((t: any) => t.isActive === isActive);
  }

  return filtered;
});

const getTemplateStats = (templateId: string) => {
  const allReports = Array.isArray(reports.value) ? reports.value : (reports.value?.data || []);
  const templateReports = allReports.filter((r: any) => r.templateId === templateId) || [];
  return {
    total: templateReports.length,
    approved: templateReports.filter((r: any) => r.status === "APPROVED")
      .length,
    pending: templateReports.filter((r: any) =>
      ["SUBMITTED", "UNDER_REVIEW"].includes(r.status),
    ).length,
    rejected: templateReports.filter((r: any) => r.status === "REJECTED")
      .length,
    lastUsed:
      templateReports.length > 0
        ? new Date(
            Math.max(
              ...templateReports.map((r: any) =>
                new Date(r.createdAt).getTime(),
              ),
            ),
          ).toLocaleDateString()
        : null,
  };
};

const getFieldsCount = (template: any) => {
  if (!template.fields || !template.fields.sections) return 0;
  return template.fields.sections.reduce(
    (acc: number, s: any) => acc + s.fields.length,
    0,
  );
};

const getSectionsCount = (template: any) => {
  if (!template.fields || !template.fields.sections) return 0;
  return template.fields.sections.length;
};

const overallStats = computed(() => {
  const allTemplates = Array.isArray(templates.value) ? templates.value : (templates.value?.data || []);
  const allReports = Array.isArray(reports.value) ? reports.value : (reports.value?.data || []);
  return {
    totalTemplates: allTemplates.length || 0,
    activeTemplates:
      allTemplates.filter((t: any) => t.isActive).length || 0,
    totalReports: allReports.length,
    pendingReview: allReports.filter((r: any) =>
      ["SUBMITTED", "UNDER_REVIEW"].includes(r.status),
    ).length,
  };
});
</script>

<template>
  <div class="space-y-8">
    <div
      class="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
    >
      <div>
        <h1 class="text-4xl font-bold text-foreground flex items-center gap-3">
          <FileStack class="h-8 w-8 text-primary" />
          Reports
        </h1>
        <p class="text-muted-foreground mt-2 text-lg">
          View and manage data from all your report templates
        </p>
      </div>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        class="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
      >
        <CardContent class="p-6">
          <div class="flex items-center gap-4">
            <div
              class="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center"
            >
              <FileText class="h-6 w-6 text-primary" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Total Templates</p>
              <p class="text-3xl font-bold">
                {{ overallStats.totalTemplates }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center gap-4">
            <div
              class="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center"
            >
              <CheckCircle class="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Active Templates</p>
              <p class="text-3xl font-bold">
                {{ overallStats.activeTemplates }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center gap-4">
            <div
              class="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center"
            >
              <BarChart3 class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Total Reports</p>
              <p class="text-3xl font-bold">{{ overallStats.totalReports }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center gap-4">
            <div
              class="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center"
            >
              <Clock class="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Pending Review</p>
              <p class="text-3xl font-bold">{{ overallStats.pendingReview }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div
      class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-muted/30 p-4 rounded-xl border"
    >
      <div class="relative flex-1 max-w-md">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
        />
        <Input
          v-model="searchQuery"
          placeholder="Search templates..."
          class="pl-11 h-11 bg-background"
        />
      </div>
      <div class="flex items-center gap-3">
        <Select v-model="selectedStatus">
          <SelectTrigger class="w-[150px] h-11">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <div class="flex bg-background rounded-lg border p-1">
          <Button
            variant="ghost"
            size="icon"
            :class="
              viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''
            "
            @click="viewMode = 'grid'"
          >
            <LayoutGrid class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            :class="
              viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''
            "
            @click="viewMode = 'list'"
          >
            <ListIcon class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <div
      v-if="filteredTemplates.length === 0"
      class="border-2 border-dashed rounded-2xl py-20 text-center"
    >
      <div
        class="inline-flex h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6"
      >
        <FileText class="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 class="text-2xl font-semibold mb-3">
        {{ searchQuery ? "No templates found" : "No templates available" }}
      </h3>
      <p class="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
        {{
          searchQuery
            ? "Try adjusting your search terms or filters."
            : "Create templates in the template builder to start collecting data."
        }}
      </p>
    </div>

    <div
      v-else-if="viewMode === 'grid'"
      class="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      <Card
        v-for="template in filteredTemplates"
        :key="template.id"
        class="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-border/60"
      >
        <div
          class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
        />

        <CardHeader class="pb-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div
                class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
              >
                <FileText class="h-6 w-6 text-primary" />
              </div>
              <div>
                <Badge
                  :variant="template.isActive ? 'default' : 'secondary'"
                  class="mb-1"
                >
                  {{ template.isActive ? "Active" : "Inactive" }}
                </Badge>
                <CardTitle class="text-xl">{{ template.name }}</CardTitle>
              </div>
            </div>
          </div>
          <CardDescription class="text-base mt-3 line-clamp-2">
            {{ template.description || "No description provided" }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          <div class="grid grid-cols-3 gap-4 py-4 bg-muted/30 rounded-lg px-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-foreground">
                {{ getSectionsCount(template) }}
              </p>
              <p class="text-xs text-muted-foreground">Sections</p>
            </div>
            <div class="text-center border-x">
              <p class="text-2xl font-bold text-foreground">
                {{ getFieldsCount(template) }}
              </p>
              <p class="text-xs text-muted-foreground">Fields</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-primary">
                {{ getTemplateStats(template.id).total }}
              </p>
              <p class="text-xs text-muted-foreground">Reports</p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Approved</span>
              <span class="font-medium text-emerald-600">{{
                getTemplateStats(template.id).approved
              }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Pending</span>
              <span class="font-medium text-amber-600">{{
                getTemplateStats(template.id).pending
              }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Rejected</span>
              <span class="font-medium text-red-600">{{
                getTemplateStats(template.id).rejected
              }}</span>
            </div>
          </div>

          <Button
            variant="default"
            :as="NuxtLink"
            :to="`/${organizationId}/reports/templates/${template.id}`"
            class="w-full"
            size="lg"
          >
            <TableIcon class="h-5 w-5 mr-2" />
            View Data
            <ChevronRight class="h-5 w-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>

    <div v-else class="space-y-4">
      <Card
        v-for="template in filteredTemplates"
        :key="template.id"
        class="hover:shadow-lg transition-all duration-200 border-border/60"
      >
        <CardContent class="p-6">
          <div class="flex items-center gap-6">
            <div
              class="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
            >
              <FileText class="h-7 w-7 text-primary" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-semibold text-foreground">
                  {{ template.name }}
                </h3>
                <Badge :variant="template.isActive ? 'default' : 'secondary'">
                  {{ template.isActive ? "Active" : "Inactive" }}
                </Badge>
              </div>
              <p class="text-muted-foreground line-clamp-1 mb-3">
                {{ template.description || "No description" }}
              </p>
              <div
                class="flex items-center gap-6 text-sm text-muted-foreground"
              >
                <span class="flex items-center gap-1.5">
                  <BarChart3 class="h-4 w-4" />
                  {{ getSectionsCount(template) }} sections
                </span>
                <span class="flex items-center gap-1.5">
                  <FileText class="h-4 w-4" />
                  {{ getFieldsCount(template) }} fields
                </span>
                <span class="flex items-center gap-1.5">
                  <FileStack class="h-4 w-4" />
                  {{ getTemplateStats(template.id).total }} reports
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <div class="flex items-center gap-1 text-sm mr-4">
                <div class="flex items-center gap-1 text-emerald-600">
                  <CheckCircle class="h-4 w-4" />
                  <span>{{ getTemplateStats(template.id).approved }}</span>
                </div>
                <div class="flex items-center gap-1 text-amber-600 ml-3">
                  <Clock class="h-4 w-4" />
                  <span>{{ getTemplateStats(template.id).pending }}</span>
                </div>
                <div class="flex items-center gap-1 text-red-600 ml-3">
                  <AlertCircle class="h-4 w-4" />
                  <span>{{ getTemplateStats(template.id).rejected }}</span>
                </div>
              </div>

              <Button
                variant="default"
                :as="NuxtLink"
                :to="`/${organizationId}/reports/templates/${template.id}`"
                size="lg"
              >
                <TableIcon class="h-5 w-5 mr-2" />
                View Data
                <ChevronRight class="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
