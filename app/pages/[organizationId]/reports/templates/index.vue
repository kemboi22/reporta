<script setup lang="ts">
import {
  Plus,
  Search,
  FileText,
  Edit3,
  Play,
  Trash2,
  Grid3x3,
  List,
  Layers,
  Activity,
  Calendar,
  Copy,
  Table as TableIcon,
} from "lucide-vue-next";
import { NuxtLink } from "#components";
import { isAdmin } from "~/utils";

definePageMeta({
  layout: "dashboard",
});

// if (!isAdmin()) {
//   navigateTo(`/${organizationId}/dashboard`);
// }

const route = useRoute();
const organizationId = route.params.organizationId as string;

const searchQuery = ref("");
const selectedStatus = ref("all");
const viewMode = ref<"grid" | "list">("grid");

const { data: templates } = await useLazyFetch(
  `/api/${organizationId}/templates`,
  {
    key: `templates-${organizationId}`,
    transform: (data) => data || [],
  },
);

const { data: reports } = await useLazyFetch(`/api/${organizationId}/reports`, {
  key: `reports-count-${organizationId}`,
  transform: (data) => data || [],
});

const filteredTemplates = computed(() => {
  let filtered = templates.value || [];

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
  const templateReports =
    reports.value?.data?.filter((r: any) => r.templateId === templateId) || [];
  return {
    total: templateReports.length,
    approved: templateReports.filter((r: any) => r.status === "APPROVED")
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

const duplicateTemplate = async (template: any) => {
  try {
    await $fetch(`/api/${organizationId}/templates`, {
      method: "POST",
      body: {
        name: `${template.name} (Copy)`,
        description: template.description,
        fields: template.fields,
        isActive: template.isActive,
      },
    });
    refreshNuxtData(`templates-${organizationId}`);
  } catch (error) {
    console.error("Failed to duplicate template:", error);
  }
};

const deleteTemplate = async (templateId: string) => {
  if (
    !confirm(
      "Are you sure you want to delete this template? This action cannot be undone.",
    )
  )
    return;
  try {
    await $fetch(`/api/${organizationId}/templates/${templateId}`, {
      method: "DELETE",
    });
    refreshNuxtData(`templates-${organizationId}`);
  } catch (error) {
    console.error("Failed to delete template:", error);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-foreground">Report Templates</h1>
        <p class="text-muted-foreground mt-1">
          {{ filteredTemplates.length }} template{{
            filteredTemplates.length !== 1 ? "s" : ""
          }}
          available
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />
          <Input
            v-model="searchQuery"
            placeholder="Search templates..."
            class="pl-10 w-[250px]"
          />
        </div>
        <Select v-model="selectedStatus">
          <SelectTrigger class="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
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
        </div>
        <Button
          :as="NuxtLink"
          :to="`/${organizationId}/reports/templates/builder`"
        >
          <Plus class="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>
    </div>

    <div
      v-if="filteredTemplates.length === 0"
      class="border-2 border-dashed rounded-lg py-16 text-center"
    >
      <div
        class="inline-flex h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4"
      >
        <FileText class="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-semibold mb-2">
        {{ searchQuery ? "No templates found" : "No templates created yet" }}
      </h3>
      <p class="text-muted-foreground mb-6 max-w-md mx-auto">
        {{
          searchQuery
            ? "Try adjusting your search terms or filters."
            : "Create your first report template to start collecting structured data from your team."
        }}
      </p>
      <Button
        v-if="!searchQuery"
        :as="NuxtLink"
        :to="`/${organizationId}/reports/templates/builder`"
      >
        <Plus class="h-4 w-4 mr-2" />
        Create Template
      </Button>
    </div>

    <div
      v-else-if="viewMode === 'grid'"
      class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      <Card
        v-for="template in filteredTemplates"
        :key="template.id"
        class="group hover:shadow-lg transition-all border-border hover:border-primary/50 cursor-pointer"
      >
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between mb-2">
            <div
              class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
            >
              <FileText class="h-5 w-5 text-primary" />
            </div>
            <Badge
              :variant="template.isActive ? 'default' : 'secondary'"
              class="text-xs"
            >
              {{ template.isActive ? "Active" : "Inactive" }}
            </Badge>
          </div>
          <CardTitle class="line-clamp-1">{{ template.name }}</CardTitle>
          <CardDescription class="line-clamp-2 text-sm">
            {{ template.description || "No description provided" }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center gap-4 text-sm text-muted-foreground">
            <div class="flex items-center gap-1.5">
              <Layers class="h-4 w-4" />
              <span>{{ getSectionsCount(template) }} sections</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Activity class="h-4 w-4" />
              <span>{{ getFieldsCount(template) }} fields</span>
            </div>
          </div>

          <div class="pt-3 border-t">
            <div
              class="flex items-center justify-between text-xs text-muted-foreground mb-3"
            >
              <span class="flex items-center gap-1">
                <FileText class="h-3 w-3" />
                {{ getTemplateStats(template.id).total }} reports created
              </span>
              <span
                v-if="getTemplateStats(template.id).lastUsed"
                class="flex items-center gap-1"
              >
                <Calendar class="h-3 w-3" />
                {{ getTemplateStats(template.id).lastUsed }}
              </span>
            </div>
            <div class="flex gap-2">
              <Button
                :as="NuxtLink"
                :to="`/${organizationId}/reports/fill/${template.id}`"
                class="flex-1"
                size="sm"
              >
                <Play class="h-3 w-3 mr-1" />
                Use
              </Button>
              <Button
                v-if="getTemplateStats(template.id).total > 0"
                variant="outline"
                size="sm"
                class="px-3"
                @click.stop="
                  navigateTo(
                    `/${organizationId}/reports/templates/${template.id}`,
                  )
                "
              >
                <TableIcon class="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="px-3"
                @click.stop="duplicateTemplate(template)"
              >
                <Copy class="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="px-3"
                @click.stop="
                  navigateTo(
                    `/${organizationId}/reports/templates/builder?templateId=${template.id}`,
                  )
                "
              >
                <Edit3 class="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else class="space-y-3">
      <Card
        v-for="template in filteredTemplates"
        :key="template.id"
        class="hover:shadow-md transition-all border-border hover:border-primary/50"
      >
        <CardContent class="p-5">
          <div class="flex items-center gap-4">
            <div
              class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
            >
              <FileText class="h-6 w-6 text-primary" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1">
                <h3 class="font-semibold text-foreground truncate">
                  {{ template.name }}
                </h3>
                <Badge
                  :variant="template.isActive ? 'default' : 'secondary'"
                  class="text-xs"
                >
                  {{ template.isActive ? "Active" : "Inactive" }}
                </Badge>
              </div>
              <p class="text-sm text-muted-foreground line-clamp-1 mb-2">
                {{ template.description || "No description" }}
              </p>
              <div
                class="flex items-center gap-4 text-xs text-muted-foreground"
              >
                <span class="flex items-center gap-1">
                  <Layers class="h-3 w-3" />
                  {{ getSectionsCount(template) }} sections
                </span>
                <span class="flex items-center gap-1">
                  <Activity class="h-3 w-3" />
                  {{ getFieldsCount(template) }} fields
                </span>
                <span class="flex items-center gap-1">
                  <FileText class="h-3 w-3" />
                  {{ getTemplateStats(template.id).total }} reports
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Button
                :as="NuxtLink"
                :to="`/${organizationId}/reports/fill/${template.id}`"
                variant="outline"
                size="sm"
              >
                <Play class="h-4 w-4 mr-2" />
                Use Template
              </Button>
              <Button
                v-if="getTemplateStats(template.id).total > 0"
                variant="outline"
                size="sm"
                @click.stop="
                  navigateTo(
                    `/${organizationId}/reports/templates/${template.id}`,
                  )
                "
              >
                <TableIcon class="h-4 w-4 mr-2" />
                View Data
              </Button>
              <Button
                variant="outline"
                size="icon"
                @click.stop="duplicateTemplate(template)"
              >
                <Copy class="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                @click.stop="
                  navigateTo(
                    `/${organizationId}/reports/templates/builder?templateId=${template.id}`,
                  )
                "
              >
                <Edit3 class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="text-destructive hover:text-destructive hover:bg-destructive/10"
                @click.stop="deleteTemplate(template.id)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
