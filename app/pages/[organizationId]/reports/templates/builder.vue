<script setup lang="ts">
import { definePageMeta, navigateTo } from "#imports";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-vue-next";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { toast } from "vue-sonner";
import { isAdmin } from "~/utils";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

if (!isAdmin()) {
  navigateTo(`/${organizationId}/dashboard`);
}

const route = useRoute();
const organizationId = route.params.organizationId as string;
const templateId = computed(() => route.query.templateId as string | undefined);
const isNew = computed(() => !templateId.value);

const {
  data: template,
  pending,
  refresh: refreshTemplate,
} = await useLazyFetch(
  computed(() =>
    templateId.value
      ? `/api/${organizationId}/templates/${templateId.value}`
      : null,
  ),
  {
    key: computed(() => `template-${templateId.value}`),
  },
);

const showPreview = ref(true);

interface TemplateField {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "checkbox";
  required: boolean;
  options?: string[] | null[];
  summable?: boolean;
  countable?: boolean;
  showInSummary?: boolean;
  groupId?: string;
}

interface TemplateSection {
  id: string;
  title: string;
  fields: TemplateField[];
}

interface FieldGroup {
  id: string;
  name: string;
  description?: string;
  fieldIds: string[];
}

const form = ref({
  name: "",
  description: "",
  sections: [] as TemplateSection[],
  feedbackTemplateId: null as string | null,
  fieldGroups: [] as FieldGroup[],
});

const allTemplates = ref<any[]>([]);

onMounted(async () => {
  try {
    allTemplates.value = await $fetch(`/api/${organizationId}/templates`);
  } catch (error) {
    console.error("Failed to fetch templates:", error);
  }
});

const addSection = () => {
  form.value.sections.push({
    id: crypto.randomUUID(),
    title: "",
    fields: [],
  });
};

const addField = (sectionIndex: number) => {
  form.value.sections[sectionIndex]?.fields.push({
    id: crypto.randomUUID(),
    label: "",
    type: "text",
    required: false,
    options: [],
    summable: false,
    countable: false,
    showInSummary: false,
    groupId: undefined,
  });
};

const addOption = (sectionIndex: number, fieldIndex: number) => {
  const field = form.value.sections[sectionIndex]?.fields[fieldIndex];
  if (!field.options) {
    field.options = [];
  }
  field?.options.push(null);
};

const addFieldGroup = () => {
  form.value.fieldGroups.push({
    id: crypto.randomUUID(),
    name: "",
    description: "",
    fieldIds: [],
  });
};

const removeFieldGroup = (groupIndex: number) => {
  const group = form.value.fieldGroups[groupIndex];
  if (group) {
    group.fieldIds.forEach((fieldId) => {
      form.value.sections.forEach((section) => {
        const field = section.fields.find((f) => f.id === fieldId);
        if (field) {
          field.groupId = undefined;
        }
      });
    });
    form.value.fieldGroups.splice(groupIndex, 1);
  }
};

const moveFieldGroup = (index: number, direction: "up" | "down") => {
  if (direction === "up" && index > 0) {
    const temp = form.value.fieldGroups[index];
    form.value.fieldGroups[index] = form.value.fieldGroups[index - 1];
    form.value.fieldGroups[index - 1] = temp;
  } else if (
    direction === "down" &&
    index < form.value.fieldGroups.length - 1
  ) {
    const temp = form.value.fieldGroups[index];
    form.value.fieldGroups[index] = form.value.fieldGroups[index + 1];
    form.value.fieldGroups[index + 1] = temp;
  }
};

const removeOption = (
  sectionIndex: number,
  fieldIndex: number,
  optionIndex: number,
) => {
  const field = form.value.sections[sectionIndex]?.fields[fieldIndex];
  if (field?.options) {
    field?.options.splice(optionIndex, 1);
  }
};

const moveSection = (index: number, direction: "up" | "down") => {
  if (direction === "up" && index > 0) {
    const temp = form.value.sections[index];
    form.value.sections[index] = form.value.sections[index - 1];
    form.value.sections[index - 1] = temp;
  } else if (direction === "down" && index < form.value.sections.length - 1) {
    const temp = form.value.sections[index];
    form.value.sections[index] = form.value.sections[index + 1];
    form.value.sections[index + 1] = temp;
  }
};

const moveField = (
  sectionIndex: number,
  fieldIndex: number,
  direction: "up" | "down",
) => {
  const fields = form.value.sections[sectionIndex].fields;
  if (direction === "up" && fieldIndex > 0) {
    const temp = fields[fieldIndex];
    fields[fieldIndex] = fields[fieldIndex - 1];
    fields[fieldIndex - 1] = temp;
  } else if (direction === "down" && fieldIndex < fields.length - 1) {
    const temp = fields[fieldIndex];
    fields[fieldIndex] = fields[fieldIndex + 1];
    fields[fieldIndex + 1] = temp;
  }
};

const fieldStats = computed(() => {
  return {
    totalSections: form.value.sections.length,
    totalFields: form.value.sections.reduce(
      (acc, s) => acc + s.fields.length,
      0,
    ),
    requiredFields: form.value.sections.reduce(
      (acc, s) => acc + s.fields.filter((f) => f.required).length,
      0,
    ),
  };
});

const allFields = computed(() => {
  const fields: Array<{ id: string; label: string; type: string }> = [];
  form.value.sections.forEach((section) => {
    section.fields.forEach((field) => {
      fields.push({
        id: field.id,
        label: field.label || "Untitled field",
        type: field.type,
      });
    });
  });
  return fields;
});

const handleFieldGroupChange = (
  fieldId: string,
  groupId: string | undefined,
) => {
  form.value.fieldGroups.forEach((group) => {
    if (group.id === groupId) {
      group.fieldIds.push(fieldId);
    } else {
      group.fieldIds = group.fieldIds.filter((id) => id !== fieldId);
    }
  });
};

const getSummaryConfig = () => {
  const config: any = {
    summableFields: [],
    countableFields: [],
    showInSummaryFields: [],
  };

  form.value.sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.summable) config.summableFields.push(field.id);
      if (field.countable) config.countableFields.push(field.id);
      if (field.showInSummary) config.showInSummaryFields.push(field.id);
    });
  });

  return config;
};

const saveTemplate = async () => {
  try {
    const summaryConfig = getSummaryConfig();
    const body = {
      name: form.value.name,
      description: form.value.description,
      fields: { sections: form.value.sections },
      summaryConfig: Object.keys(summaryConfig).some(
        (k) => (summaryConfig as any)[k].length > 0,
      )
        ? summaryConfig
        : null,
      feedbackTemplateId: form.value.feedbackTemplateId || null,
      fieldGroups:
        form.value.fieldGroups.length > 0 ? form.value.fieldGroups : null,
    };
    console.log(isNew.value);

    if (isNew.value) {
      await $fetch(`/api/${organizationId}/templates`, {
        method: "POST",
        body,
      });
    } else {
      await $fetch(`/api/${organizationId}/templates/${templateId.value}`, {
        method: "PUT",
        body,
      });
      await refreshNuxtData(`templates-${organizationId}`);
    }
    toast.success("Template saved successfully");
    await navigateTo(`/${organizationId}/reports/templates`);
  } catch (error) {
    console.error("Failed to save template:", error);
    toast.error("Failed to save template");
  }
};
watch(
  () => template.value,
  (t) => {
    if (!isNew.value && template.value) {
      form.value.name = template.value.name;
      form.value.description = template.value.description || "";
      form.value.feedbackTemplateId = template.value.feedbackTemplateId || null;

      const loadedGroups = template.value.fieldGroups || [];
      form.value.fieldGroups = loadedGroups.map((group: any) => ({
        id: group.id || crypto.randomUUID(),
        name: group.name || "",
        description: group.description || "",
        fieldIds: group.fieldIds || [],
      }));

      const sections = (template.value.fields as any)?.sections || [];
      form.value.sections = sections.map((section: any) => ({
        ...section,
        fields: (section.fields || []).map((field: any) => ({
          ...field,
          required: field.required ?? false,
          summable: field.summable ?? false,
          countable: field.countable ?? false,
          showInSummary: field.showInSummary ?? false,
          groupId: field.groupId ?? undefined,
          options: field.options || [],
        })),
      }));

      const fieldIdToGroupIdMap: Record<string, string> = {};
      form.value.fieldGroups.forEach((group) => {
        group.fieldIds.forEach((fieldId) => {
          fieldIdToGroupIdMap[fieldId] = group.id;
        });
      });

      form.value.sections.forEach((section) => {
        section.fields.forEach((field) => {
          if (fieldIdToGroupIdMap[field.id] && !field.groupId) {
            field.groupId = fieldIdToGroupIdMap[field.id];
          }
        });
      });
    } else if (isNew.value) {
      form.value.sections = [];
      form.value.fieldGroups = [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <TooltipProvider>
    <div class="space-y-6">
      <div v-if="pending && !isNew">
        <div class="flex items-center justify-center py-12">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          ></div>
        </div>
      </div>

      <div v-else>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-foreground">
              {{ isNew ? "New Template" : "Edit Template" }}
            </h1>
            <p class="text-muted-foreground mt-1">
              {{
                isNew
                  ? "Create a new report template"
                  : `Edit: ${template?.name}`
              }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 mr-4">
              <Switch v-model="showPreview" />
              <Label class="cursor-pointer text-sm">Live Preview</Label>
            </div>
            <Button
              variant="outline"
              @click="navigateTo(`/${organizationId}/reports/templates`)"
            >
              Cancel
            </Button>
            <Button @click="saveTemplate">
              {{ isNew ? "Create Template" : "Save Template" }}
            </Button>
          </div>
        </div>

        <div
          class="grid gap-6"
          :class="showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'"
        >
          <div class="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                  Template Details
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div>
                  <Label class="text-sm font-medium">Template Name</Label>
                  <Input
                    v-model="form.name"
                    placeholder="Enter template name"
                    class="mt-1"
                  />
                </div>
                <div>
                  <Label class="text-sm font-medium">Description</Label>
                  <Textarea
                    v-model="form.description"
                    placeholder="Template description..."
                    rows="3"
                    class="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    ></path>
                  </svg>
                  Feedback & Summary Settings
                </CardTitle>
                <p class="text-sm text-muted-foreground">
                  Configure how reports are analyzed and what happens after
                  submission
                </p>
              </CardHeader>
              <CardContent class="space-y-4">
                <div>
                  <Label class="text-sm font-medium"
                    >Feedback Template (Optional)</Label
                  >
                  <p class="text-xs text-muted-foreground mb-2">
                    Users will be redirected to this template form after
                    submitting a report
                  </p>
                  <Select v-model="form.feedbackTemplateId">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a feedback template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="null">-- None --</SelectItem>
                      <SelectItem
                        v-for="t in allTemplates.filter(
                          (t) => t.id !== templateId,
                        )"
                        :key="t.id"
                        :value="t.id"
                      >
                        {{ t.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div class="flex items-center justify-between">
                  <div>
                    <CardTitle class="flex items-center gap-2">
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        ></path>
                      </svg>
                      Field Groups
                    </CardTitle>
                    <p class="text-sm text-muted-foreground mt-1">
                      Group fields for combined analysis in reports
                    </p>
                  </div>
                  <Button @click="addFieldGroup" size="sm" variant="outline">
                    <Plus class="w-4 h-4 mr-2" />
                    Add Group
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  v-if="form.fieldGroups.length === 0"
                  class="border-2 border-dashed rounded-lg py-8 text-center"
                >
                  <svg
                    class="w-12 h-12 mx-auto text-muted-foreground mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                  <p class="text-muted-foreground">No field groups defined</p>
                  <p class="text-sm text-muted-foreground mt-1">
                    Create groups to organize related fields
                  </p>
                </div>

                <div v-else class="space-y-3">
                  <div
                    v-for="(group, gIndex) in form.fieldGroups"
                    :key="group.id"
                    class="border rounded-lg overflow-hidden bg-card"
                  >
                    <div
                      class="bg-muted/50 px-4 py-3 flex items-center justify-between border-b"
                    >
                      <div class="flex-1 flex items-center gap-3">
                        <GripVertical
                          class="w-5 h-5 text-muted-foreground cursor-move"
                        />
                        <Input
                          v-model="group.name"
                          placeholder="Group name"
                          class="bg-background border-input h-9 flex-1"
                        />
                      </div>
                      <div class="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8"
                          @click="moveFieldGroup(gIndex, 'up')"
                          :disabled="gIndex === 0"
                        >
                          <ArrowUp class="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8"
                          @click="moveFieldGroup(gIndex, 'down')"
                          :disabled="gIndex === form.fieldGroups.length - 1"
                        >
                          <ArrowDown class="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8 text-destructive hover:text-destructive"
                          @click="removeFieldGroup(gIndex)"
                        >
                          <Trash2 class="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div class="p-4 space-y-3">
                      <div>
                        <Label class="text-xs text-muted-foreground"
                          >Description (Optional)</Label
                        >
                        <Input
                          v-model="group.description"
                          placeholder="What this group analyzes..."
                          class="mt-1 text-sm h-9"
                        />
                      </div>
                      <div>
                        <Label class="text-xs text-muted-foreground"
                          >Fields in this group ({{
                            group.fieldIds.length
                          }})</Label
                        >
                        <div
                          v-if="group.fieldIds.length === 0"
                          class="text-center py-2 text-xs text-muted-foreground border border-dashed rounded"
                        >
                          No fields assigned. Select a group from the field
                          settings to add.
                        </div>
                        <div v-else class="mt-2 space-y-1">
                          <div
                            v-for="fieldId in group.fieldIds"
                            :key="fieldId"
                            class="flex items-center justify-between gap-2 bg-muted/50 px-3 py-2 rounded"
                          >
                            <span class="text-sm">
                              {{
                                allFields.find((f) => f.id === fieldId)
                                  ?.label || fieldId
                              }}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              class="h-6 w-6"
                              @click="
                                group.fieldIds = group.fieldIds.filter(
                                  (id) => id !== fieldId,
                                );
                                form.value.sections.forEach((s) => {
                                  const f = s.fields.find(
                                    (field) => field.id === fieldId,
                                  );
                                  if (f) f.groupId = undefined;
                                });
                              "
                            >
                              <Trash2 class="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div class="flex items-center justify-between">
                  <CardTitle class="flex items-center gap-2">
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      ></path>
                    </svg>
                    Template Structure
                  </CardTitle>
                  <Button @click="addSection" size="sm" variant="outline">
                    <Plus class="w-4 h-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  v-if="form.sections.length === 0"
                  class="border-2 border-dashed rounded-lg py-12 text-center"
                >
                  <svg
                    class="w-12 h-12 mx-auto text-muted-foreground mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                  <p class="text-muted-foreground">No sections added yet</p>
                  <p class="text-sm text-muted-foreground mt-1">
                    Click "Add Section" to get started
                  </p>
                </div>

                <div v-else class="space-y-4">
                  <div
                    v-for="(section, sIndex) in form.sections"
                    :key="section.id"
                    class="border rounded-lg overflow-hidden bg-card"
                  >
                    <div
                      class="bg-muted/50 px-4 py-3 flex items-center justify-between border-b"
                    >
                      <div class="flex-1 flex items-center gap-3">
                        <GripVertical
                          class="w-5 h-5 text-muted-foreground cursor-move"
                        />
                        <Input
                          v-model="section.title"
                          placeholder="Section title"
                          class="bg-background border-input h-9"
                        />
                      </div>
                      <div class="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8"
                          @click="moveSection(sIndex, 'up')"
                          :disabled="sIndex === 0"
                        >
                          <ArrowUp class="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8"
                          @click="moveSection(sIndex, 'down')"
                          :disabled="sIndex === form.sections.length - 1"
                        >
                          <ArrowDown class="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8 text-destructive hover:text-destructive"
                          @click="form.sections.splice(sIndex, 1)"
                        >
                          <Trash2 class="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div class="p-4 space-y-3">
                      <div class="flex items-center justify-between">
                        <Label class="text-sm font-medium text-muted-foreground"
                          >Fields ({{ section.fields.length }})</Label
                        >
                        <Button
                          @click="addField(sIndex)"
                          size="sm"
                          variant="outline"
                          class="h-8"
                        >
                          <Plus class="w-3 h-3 mr-1" />
                          Add Field
                        </Button>
                      </div>

                      <div
                        v-if="section.fields.length === 0"
                        class="text-center py-6 border border-dashed rounded-lg"
                      >
                        <p class="text-sm text-muted-foreground">
                          No fields in this section
                        </p>
                      </div>

                      <div v-else class="space-y-2">
                        <div
                          v-for="(field, fIndex) in section.fields"
                          :key="field.id"
                          class="border rounded-md p-3 bg-muted/30 space-y-2"
                        >
                          <div class="flex items-start gap-3">
                            <GripVertical
                              class="w-4 h-4 text-muted-foreground cursor-move mt-1.5"
                            />
                            <div class="flex-1 space-y-2">
                              <div class="flex gap-2">
                                <Input
                                  v-model="field.label"
                                  placeholder="Field label"
                                  class="flex-1"
                                />
                                <Select v-model="field.type">
                                  <SelectTrigger class="w-[140px] h-9">
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="textarea"
                                      >Textarea</SelectItem
                                    >
                                    <SelectItem value="number"
                                      >Number</SelectItem
                                    >
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="select"
                                      >Dropdown</SelectItem
                                    >
                                    <SelectItem value="checkbox"
                                      >Checkbox</SelectItem
                                    >
                                  </SelectContent>
                                </Select>
                              </div>

                              <div
                                v-if="form.fieldGroups.length > 0"
                                class="flex items-center gap-2 pt-2"
                              >
                                <Label class="text-xs text-muted-foreground"
                                  >Group</Label
                                >
                                <Select
                                  :model-value="field.groupId"
                                  @update:model-value="
                                    (val) => {
                                      field.groupId = val;
                                      handleFieldGroupChange(field.id, val);
                                    }
                                  "
                                >
                                  <SelectTrigger class="h-8 w-full">
                                    <SelectValue placeholder="None" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem :value="null"
                                      >-- None --</SelectItem
                                    >
                                    <SelectItem
                                      v-for="group in form.fieldGroups"
                                      :key="group.id"
                                      :value="group.id"
                                    >
                                      {{ group.name || "Untitled group" }}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div
                                v-else-if="
                                  (form.fieldGroups.length === 0 &&
                                    field.summable) ||
                                  field.countable ||
                                  field.showInSummary
                                "
                                class="text-xs text-muted-foreground pt-1 italic"
                              >
                                Create a field group above to organize analysis
                              </div>

                              <div
                                v-if="field.type === 'select'"
                                class="space-y-2 pt-2 border-t"
                              >
                                <Label class="text-xs text-muted-foreground"
                                  >Dropdown Options</Label
                                >
                                <div
                                  v-if="
                                    !field.options || field.options.length === 0
                                  "
                                  class="text-center py-2 text-xs text-muted-foreground border border-dashed rounded"
                                >
                                  No options added
                                </div>
                                <div v-else class="space-y-1">
                                  <div
                                    v-for="(option, oIndex) in field.options"
                                    :key="oIndex"
                                    class="flex items-center gap-2"
                                  >
                                    <Input
                                      v-model="field.options[oIndex]"
                                      placeholder="Option"
                                      class="h-8 text-sm"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      class="h-8 w-8 text-destructive hover:text-destructive"
                                      @click="
                                        removeOption(sIndex, fIndex, oIndex)
                                      "
                                    >
                                      <Trash2 class="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <Button
                                  @click="addOption(sIndex, fIndex)"
                                  size="sm"
                                  variant="outline"
                                  class="w-full h-8"
                                >
                                  <Plus class="w-3 h-3 mr-1" />
                                  Add Option
                                </Button>
                              </div>
                              <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                  <Switch
                                    v-model="field.required"
                                    class="h-5 w-9"
                                  />
                                  <Label class="text-sm cursor-pointer"
                                    >Required</Label
                                  >
                                </div>
                                <div class="flex items-center gap-1">
                                  <div
                                    v-if="field.type === 'number'"
                                    class="flex items-center gap-2"
                                  >
                                    <Tooltip>
                                      <TooltipTrigger as-child>
                                        <div class="flex items-center gap-1">
                                          <Switch
                                            v-model="field.summable"
                                            class="h-5 w-7"
                                          />
                                          <Label class="text-xs cursor-pointer"
                                            >Sum</Label
                                          >
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Sum this field across all reports</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                </div>
                              </div>

                              <div
                                v-if="
                                  field.type === 'number' ||
                                  field.type === 'checkbox'
                                "
                                class="flex items-center justify-between"
                              >
                                <div class="flex items-center gap-2">
                                  <Tooltip>
                                    <TooltipTrigger as-child>
                                      <div class="flex items-center gap-1">
                                        <Switch
                                          v-model="field.showInSummary"
                                          class="h-5 w-7"
                                        />
                                        <Label class="text-xs cursor-pointer"
                                          >Show in Summary</Label
                                        >
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Show this field in report summaries</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <div class="flex items-center gap-1">
                                  <Tooltip>
                                    <TooltipTrigger as-child>
                                      <div class="flex items-center gap-1">
                                        <Switch
                                          v-model="field.countable"
                                          class="h-5 w-7"
                                        />
                                        <Label class="text-xs cursor-pointer"
                                          >Count</Label
                                        >
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        Count non-empty values across all
                                        reports
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>

                              <div
                                class="flex items-center justify-between pt-2"
                              >
                                <div class="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    class="h-6 w-6"
                                    @click="moveField(sIndex, fIndex, 'up')"
                                    :disabled="fIndex === 0"
                                  >
                                    <ArrowUp class="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    class="h-6 w-6"
                                    @click="moveField(sIndex, fIndex, 'down')"
                                    :disabled="
                                      fIndex === section.fields.length - 1
                                    "
                                  >
                                    <ArrowDown class="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    class="h-6 w-6 text-destructive hover:text-destructive"
                                    @click="section.fields.splice(fIndex, 1)"
                                  >
                                    <Trash2 class="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card v-if="fieldStats.totalSections > 0" class="bg-muted/50">
              <CardContent class="pt-6">
                <div class="flex items-center justify-around text-center">
                  <div>
                    <p class="text-2xl font-bold text-foreground">
                      {{ fieldStats.totalSections }}
                    </p>
                    <p class="text-sm text-muted-foreground">Sections</p>
                  </div>
                  <div class="h-8 w-px bg-border"></div>
                  <div>
                    <p class="text-2xl font-bold text-foreground">
                      {{ fieldStats.totalFields }}
                    </p>
                    <p class="text-sm text-muted-foreground">Total Fields</p>
                  </div>
                  <div class="h-8 w-px bg-border"></div>
                  <div>
                    <p class="text-2xl font-bold text-foreground">
                      {{ form.fieldGroups.length }}
                    </p>
                    <p class="text-sm text-muted-foreground">Field Groups</p>
                  </div>
                  <div class="h-8 w-px bg-border"></div>
                  <div>
                    <p class="text-2xl font-bold text-foreground">
                      {{ fieldStats.requiredFields }}
                    </p>
                    <p class="text-sm text-muted-foreground">Required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div v-if="showPreview" class="space-y-6">
            <Card class="sticky top-6">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Eye class="w-5 h-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  v-if="!form.name && form.sections.length === 0"
                  class="py-12 text-center"
                >
                  <svg
                    class="w-12 h-12 mx-auto text-muted-foreground mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  <p class="text-muted-foreground">
                    Start editing the template to see preview
                  </p>
                </div>

                <div v-else class="space-y-6">
                  <div>
                    <h2 class="text-2xl font-bold mb-2">
                      {{ form.name || "Untitled Template" }}
                    </h2>
                    <p v-if="form.description" class="text-muted-foreground">
                      {{ form.description }}
                    </p>
                  </div>

                  <div
                    v-if="form.sections.length === 0"
                    class="text-center py-8 border border-dashed rounded-lg text-muted-foreground"
                  >
                    No sections defined yet
                  </div>

                  <div v-else class="space-y-6">
                    <div
                      v-for="section in form.sections"
                      :key="section.id"
                      class="space-y-4"
                    >
                      <div v-if="section.title" class="border-b pb-2">
                        <h3 class="text-lg font-semibold">
                          {{ section.title }}
                        </h3>
                      </div>

                      <div
                        v-if="section.fields.length === 0"
                        class="text-center py-4 text-sm text-muted-foreground border border-dashed rounded"
                      >
                        No fields in this section
                      </div>

                      <div v-else class="space-y-4">
                        <div
                          v-for="field in section.fields"
                          :key="field.id"
                          class="space-y-2"
                        >
                          <Label class="flex items-center gap-2">
                            {{ field.label || "Untitled field" }}
                            <Badge
                              v-if="field.required"
                              variant="destructive"
                              class="h-5 px-2 py-0 text-xs"
                              >Required</Badge
                            >
                          </Label>

                          <div v-if="field.type === 'text'" class="w-full">
                            <Input
                              :placeholder="field.label"
                              disabled
                              class="opacity-70"
                            />
                          </div>
                          <div v-else-if="field.type === 'textarea'">
                            <Textarea
                              :placeholder="field.label"
                              rows="3"
                              disabled
                              class="opacity-70"
                            />
                          </div>
                          <div v-else-if="field.type === 'number'">
                            <Input
                              type="number"
                              :placeholder="field.label"
                              disabled
                              class="opacity-70"
                            />
                          </div>
                          <div v-else-if="field.type === 'date'">
                            <Input type="date" disabled class="opacity-70" />
                          </div>
                          <div v-else-if="field.type === 'select'">
                            <Select disabled>
                              <SelectTrigger class="opacity-70">
                                <SelectValue
                                  :placeholder="field.label || 'Select option'"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem :value="null"
                                  >-- Select --</SelectItem
                                >
                                <SelectItem
                                  v-for="option in field.options || []"
                                  :key="option"
                                  :value="option"
                                >
                                  {{ option }}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div v-else-if="field.type === 'checkbox'">
                            <div class="flex items-center gap-2">
                              <input
                                type="checkbox"
                                disabled
                                class="rounded border-input h-4 w-4"
                              />
                              <Label
                                class="text-sm text-muted-foreground cursor-pointer"
                                >{{ field.label }}</Label
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </TooltipProvider>
</template>
