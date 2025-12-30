<script setup lang="ts">
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const templateId = route.query.templateId as string;
const {
  data: template,
  pending,
  refresh: refreshTemplate,
} = await useLazyFetch(
  templateId ? `/api/${organizationId}/templates/${templateId}` : null,
  {
    key: `template-${templateId}`,
  },
);

const showPreview = ref(true);
const isNew = computed(() => !templateId);

interface TemplateField {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "checkbox";
  required: boolean;
  options?: string[] | null[];
}

interface TemplateSection {
  id: string;
  title: string;
  fields: TemplateField[];
}

const form = ref({
  name: "",
  description: "",
  sections: [] as TemplateSection[],
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
  });
};

const addOption = (sectionIndex: number, fieldIndex: number) => {
  const field = form.value.sections[sectionIndex]?.fields[fieldIndex];
  if (!field.options) {
    field.options = [];
  }
  field?.options.push(null);
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

const saveTemplate = async () => {
  try {
    if (isNew.value) {
      await $fetch(`/api/${organizationId}/templates`, {
        method: "POST",
        body: {
          name: form.value.name,
          description: form.value.description,
          fields: { sections: form.value.sections },
        },
      });
    } else {
      await $fetch(`/api/${organizationId}/templates/${templateId}`, {
        method: "PUT",
        body: {
          name: form.value.name,
          description: form.value.description,
          fields: { sections: form.value.sections },
        },
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
      form.value.sections = (template.value.fields as any)?.sections || [];
    }
  },
);
</script>

<template>
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
              isNew ? "Create a new report template" : `Edit: ${template?.name}`
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
                                  <SelectItem value="number">Number</SelectItem>
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
                      <h3 class="text-lg font-semibold">{{ section.title }}</h3>
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
</template>
