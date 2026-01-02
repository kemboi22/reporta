<script setup lang="ts">
import { Eye, Save, CheckCircle, AlertCircle, Plus, X, FileStack } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Checkbox } from "@/components/ui/checkbox";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const templateId = route.params.id as string;

const { data: template, pending } = await useLazyFetch(
  `/api/${organizationId}/templates/${templateId}`,
  {
    key: `template-${templateId}`,
  },
);

interface RecordForm {
  id: string;
  title: string;
  content: Record<string, any>;
}

const records = ref<RecordForm[]>([
  {
    id: crypto.randomUUID(),
    title: "",
    content: {},
  },
]);

const activeRecordIndex = ref(0);
const showPreview = ref(false);
const isSubmitting = ref(false);
const touchedFields = ref<Set<string>>(new Set());

const activeRecord = computed(() => records.value[activeRecordIndex.value]);

const sections = computed(() => {
  if (!template.value?.fields) return [];
  return (template.value.fields as any).sections || [];
});

const fieldErrors = computed(() => {
  const errors: Record<string, string> = {};
  sections.value.forEach((section: any) => {
    section.fields.forEach((field: any) => {
      if (
        field.required &&
        !activeRecord.value.content[field.id] &&
        touchedFields.value.has(`${activeRecord.id}-${field.id}`)
      ) {
        errors[field.id] = `${field.label || "This field"} is required`;
      }
    });
  });
  return errors;
});

const recordProgress = computed(() => {
  let totalRequired = 0;
  let filledRequired = 0;
  sections.value.forEach((section: any) => {
    section.fields.forEach((field: any) => {
      if (field.required) {
        totalRequired++;
        if (activeRecord.value.content[field.id]) {
          filledRequired++;
        }
      }
    });
  });
  return totalRequired === 0
    ? 100
    : Math.round((filledRequired / totalRequired) * 100);
});

const overallProgress = computed(() => {
  if (records.value.length === 0) return 100;
  const total = records.value.reduce((acc, record) => {
    let recordRequired = 0;
    let recordFilled = 0;
    sections.value.forEach((section: any) => {
      section.fields.forEach((field: any) => {
        if (field.required) {
          recordRequired++;
          if (record.content[field.id]) {
            recordFilled++;
          }
        }
      });
    });
    return acc + (recordRequired === 0 ? 100 : Math.round((recordFilled / recordRequired) * 100));
  }, 0);
  return Math.round(total / records.value.length);
});

const validateRecord = (record: RecordForm) => {
  let isValid = true;
  sections.value.forEach((section: any) => {
    section.fields.forEach((field: any) => {
      touchedFields.value.add(`${record.id}-${field.id}`);
      if (field.required && !record.content[field.id]) {
        isValid = false;
      }
    });
  });
  return isValid;
};

const validateAllRecords = () => {
  let allValid = true;
  records.value.forEach(record => {
    if (!validateRecord(record)) {
      allValid = false;
    }
  });
  return allValid;
};

const handleFieldChange = (recordId: string, fieldId: string, value: any) => {
  const record = records.value.find(r => r.id === recordId);
  if (record) {
    record.content[fieldId] = value;
    touchedFields.value.add(`${recordId}-${fieldId}`);
  }
};

const addRecord = () => {
  records.value.push({
    id: crypto.randomUUID(),
    title: "",
    content: {},
  });
  activeRecordIndex.value = records.value.length - 1;
  touchedFields.value.clear();
};

const removeRecord = (index: number) => {
  if (records.value.length <= 1) {
    toast.error("You need at least one record");
    return;
  }
  records.value.splice(index, 1);
  if (activeRecordIndex.value >= records.value.length) {
    activeRecordIndex.value = records.value.length - 1;
  }
  touchedFields.value.clear();
};

const createReportsFromTemplates = async () => {
  if (!validateAllRecords()) {
    toast.error("Please fill in all required fields");
    return;
  }

  isSubmitting.value = true;
  try {
    const reports = await $fetch(`/api/${organizationId}/reports`, {
      method: "POST",
      body: {
        templateId,
        records: records.value.map(record => ({
          title: record.title || template.value?.name,
          content: record.content,
        })),
      },
    });
    toast.success(`${reports.length} report(s) created successfully`);
    navigateTo(`/${organizationId}/reports`);
  } catch (error) {
    console.error("Failed to create reports:", error);
    toast.error("Failed to create reports");
  } finally {
    isSubmitting.value = false;
  }
};

const submitReports = async () => {
  await createReportsFromTemplates();
};
</script>

<template>
  <div v-if="pending" class="flex items-center justify-center py-12">
    <div
      class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
    ></div>
  </div>

  <div v-else-if="template" class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">{{ template.name }}</h1>
        <p class="text-muted-foreground mt-1">
          {{ template.description || "Fill in the report" }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 mr-4">
          <Switch v-model="showPreview" />
          <Label class="cursor-pointer text-sm">Preview</Label>
        </div>
        <Button
          variant="outline"
          @click="navigateTo(`/${organizationId}/reports/templates`)"
        >
          Cancel
        </Button>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <FileStack class="h-5 w-5 text-muted-foreground" />
        <span class="text-sm text-muted-foreground">
          {{ records.length }} record{{ records.length !== 1 ? 's' : '' }}
        </span>
        <Badge :variant="overallProgress === 100 ? 'default' : 'secondary'">
          {{ overallProgress }}% Complete
        </Badge>
      </div>
      <Button variant="outline" size="sm" @click="addRecord">
        <Plus class="h-4 w-4 mr-2" />
        Add Record
      </Button>
    </div>

    <div class="flex gap-2 overflow-x-auto pb-2">
      <Button
        v-for="(record, index) in records"
        :key="record.id"
        variant="outline"
        size="sm"
        :class="[
          'flex-shrink-0 transition-all',
          activeRecordIndex === index ? 'border-primary bg-primary/5' : ''
        ]"
        @click="activeRecordIndex = index"
      >
        Record {{ index + 1 }}
        <button
          v-if="records.length > 1"
          @click.stop="removeRecord(index)"
          class="ml-2 rounded-full hover:bg-destructive/10 p-0.5"
        >
          <X class="h-3 w-3 text-muted-foreground hover:text-destructive" />
        </button>
      </Button>
    </div>

    <div
      class="grid gap-6"
      :class="showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'"
    >
      <div class="space-y-6">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                Record Details
              </CardTitle>
              <Badge :variant="recordProgress === 100 ? 'default' : 'secondary'">
                {{ recordProgress }}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <Label class="text-sm font-medium">Report Title</Label>
              <Input
                v-model="activeRecord.title"
                :placeholder="template.name"
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                Fill Form
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div
              v-if="sections.length === 0"
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
              <p class="text-muted-foreground">
                No fields defined in this template.
              </p>
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="(section, sIndex) in sections"
                :key="section.id"
                class="space-y-4"
              >
                <div class="border-b pb-2">
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <span
                      class="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm"
                    >
                      {{ sIndex + 1 }}
                    </span>
                    {{ section.title }}
                  </h3>
                </div>

                <div class="space-y-4 pl-8">
                  <div
                    v-for="field in section.fields"
                    :key="field.id"
                    class="space-y-2"
                  >
                    <Label class="flex items-center gap-2">
                      {{ field.label }}
                      <span v-if="field.required" class="text-red-500">*</span>
                      <Badge
                        v-if="
                          touchedFields.has(`${activeRecord.id}-${field.id}`) && fieldErrors[field.id]
                        "
                        variant="destructive"
                        class="h-5 px-2 py-0 text-xs"
                      >
                        Required
                      </Badge>
                    </Label>

                    <Input
                      v-if="field.type === 'text'"
                      v-model="activeRecord.content[field.id]"
                      :placeholder="field.label"
                      @blur="touchedFields.add(`${activeRecord.id}-${field.id}`)"
                      :class="{
                        'border-destructive focus-visible:ring-destructive':
                          fieldErrors[field.id],
                      }"
                    />

                    <Textarea
                      v-else-if="field.type === 'textarea'"
                      v-model="activeRecord.content[field.id]"
                      :placeholder="field.label"
                      rows="3"
                      @blur="touchedFields.add(`${activeRecord.id}-${field.id}`)"
                      :class="{
                        'border-destructive focus-visible:ring-destructive':
                          fieldErrors[field.id],
                      }"
                    />

                    <Input
                      v-else-if="field.type === 'number'"
                      v-model.number="activeRecord.content[field.id]"
                      type="number"
                      :placeholder="field.label"
                      @blur="touchedFields.add(`${activeRecord.id}-${field.id}`)"
                      :class="{
                        'border-destructive focus-visible:ring-destructive':
                          fieldErrors[field.id],
                      }"
                    />

                    <Input
                      v-else-if="field.type === 'date'"
                      v-model="activeRecord.content[field.id]"
                      type="date"
                      @blur="touchedFields.add(`${activeRecord.id}-${field.id}`)"
                      :class="{
                        'border-destructive focus-visible:ring-destructive':
                          fieldErrors[field.id],
                      }"
                    />

                    <Select
                      v-else-if="field.type === 'select'"
                      v-model="activeRecord.content[field.id]"
                      @blur="touchedFields.add(`${activeRecord.id}-${field.id}`)"
                    >
                      <SelectTrigger
                        :class="{
                          'border-destructive focus-visible:ring-destructive':
                            fieldErrors[field.id],
                        }"
                      >
                        <SelectValue
                          :placeholder="field.label || 'Select an option'"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem :value="undefined">-- Select --</SelectItem>
                        <SelectItem
                          v-for="option in field.options || []"
                          :key="option"
                          :value="option"
                        >
                          {{ option }}
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <div
                      v-else-if="field.type === 'checkbox'"
                      class="flex items-center gap-2"
                    >
                      <Checkbox
                        v-model="activeRecord.content[field.id]"
                        @update:model-value="touchedFields.add(`${activeRecord.id}-${field.id}`)"
                      />
                      <Label
                        class="text-sm text-muted-foreground cursor-pointer"
                        >{{ field.label }}</Label
                      >
                    </div>

                    <p
                      v-if="fieldErrors[field.id]"
                      class="text-sm text-destructive flex items-center gap-1"
                    >
                      <AlertCircle class="w-4 h-4" />
                      {{ fieldErrors[field.id] }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-6 border-t mt-6">
              <Button
                @click="submitReports"
                class="w-full"
                size="lg"
                :disabled="isSubmitting"
              >
                <Save class="w-4 h-4 mr-2" />
                {{ isSubmitting ? "Submitting..." : `Submit ${records.length} Report${records.length !== 1 ? 's' : ''}` }}
              </Button>
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
          <CardContent class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold mb-2">
                {{ activeRecord.title || template.name }}
              </h2>
              <p class="text-sm text-muted-foreground">
                Generated on {{ new Date().toLocaleDateString() }}
              </p>
            </div>

            <div
              v-if="sections.length === 0"
              class="text-center py-8 border border-dashed rounded-lg text-muted-foreground"
            >
              No sections defined
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="(section, sIndex) in sections"
                :key="section.id"
                class="space-y-3"
              >
                <div v-if="section.title" class="border-b pb-2">
                  <h3 class="font-semibold text-lg">{{ section.title }}</h3>
                </div>

                <div class="space-y-3 pl-2">
                  <div
                    v-for="field in section.fields"
                    :key="field.id"
                    class="space-y-1"
                  >
                    <p class="text-sm font-medium text-muted-foreground">
                      {{ field.label }}
                    </p>
                    <div class="rounded-md border bg-muted/50 p-3">
                      <p
                        v-if="activeRecord.content[field.id]"
                        class="text-foreground"
                      >
                        {{ activeRecord.content[field.id] }}
                      </p>
                      <p v-else class="text-muted-foreground text-sm italic">
                        Not filled
                      </p>
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
</template>
