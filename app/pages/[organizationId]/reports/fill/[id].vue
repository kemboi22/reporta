<script setup lang="ts">
import { Eye, Save, CheckCircle, AlertCircle } from "lucide-vue-next";
import { toast } from "vue-sonner";

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

const formData = ref({
  title: "",
  content: {} as Record<string, any>,
});

const showPreview = ref(false);
const isSubmitting = ref(false);
const touchedFields = ref<Set<string>>(new Set());

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
        !formData.value.content[field.id] &&
        touchedFields.value.has(field.id)
      ) {
        errors[field.id] = `${field.label || "This field"} is required`;
      }
    });
  });
  return errors;
});

const progress = computed(() => {
  let totalRequired = 0;
  let filledRequired = 0;
  sections.value.forEach((section: any) => {
    section.fields.forEach((field: any) => {
      if (field.required) {
        totalRequired++;
        if (formData.value.content[field.id]) {
          filledRequired++;
        }
      }
    });
  });
  return totalRequired === 0
    ? 100
    : Math.round((filledRequired / totalRequired) * 100);
});

const validateForm = () => {
  let isValid = true;
  sections.value.forEach((section: any) => {
    section.fields.forEach((field: any) => {
      touchedFields.value.add(field.id);
      if (field.required && !formData.value.content[field.id]) {
        isValid = false;
      }
    });
  });
  return isValid;
};

const handleFieldChange = (fieldId: string, value: any) => {
  formData.value.content[fieldId] = value;
  touchedFields.value.add(fieldId);
};

const createReportFromTemplate = async () => {
  if (!validateForm()) {
    toast.error("Please fill in all required fields");
    return;
  }

  isSubmitting.value = true;
  try {
    const report = await $fetch(`/api/${organizationId}/reports`, {
      method: "POST",
      body: {
        title: formData.value.title || template.value?.name,
        templateId,
        content: formData.value.content,
      },
    });
    toast.success("Report created successfully");
    navigateTo(`/${organizationId}/reports/view/${report.id}`);
  } catch (error) {
    console.error("Failed to create report:", error);
    toast.error("Failed to create report");
  } finally {
    isSubmitting.value = false;
  }
};

const submitReport = async () => {
  await createReportFromTemplate();
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
                Report Details
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <Label class="text-sm font-medium">Report Title</Label>
              <Input
                v-model="formData.title"
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
              <Badge :variant="progress === 100 ? 'default' : 'secondary'">
                {{ progress }}% Complete
              </Badge>
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
                          touchedFields.has(field.id) && fieldErrors[field.id]
                        "
                        variant="destructive"
                        class="h-5 px-2 py-0 text-xs"
                      >
                        Required
                      </Badge>
                    </Label>

                    <Input
                      v-if="field.type === 'text'"
                      v-model="formData.content[field.id]"
                      :placeholder="field.label"
                      @blur="touchedFields.add(field.id)"
                      :class="{
                        'border-destructive focus-visible:ring-destructive':
                          fieldErrors[field.id],
                      }"
                    />

                    <Textarea
                      v-else-if="field.type === 'textarea'"
                      v-model="formData.content[field.id]"
                      :placeholder="field.label"
                      rows="3"
                      @blur="touchedFields.add(field.id)"
                      :class="{
                        'border-destructive focus-visible:ring-destructive':
                          fieldErrors[field.id],
                      }"
                    />

                    <Input
                      v-else-if="field.type === 'number'"
                      v-model.number="formData.content[field.id]"
                      type="number"
                      :placeholder="field.label"
                      @blur="touchedFields.add(field.id)"
                      :class="{
                        'border-destructive focus-visible:ring-destructive':
                          fieldErrors[field.id],
                      }"
                    />

                    <Input
                      v-else-if="field.type === 'date'"
                      v-model="formData.content[field.id]"
                      type="date"
                      @blur="touchedFields.add(field.id)"
                      :class="{
                        'border-destructive focus-visible:ring-destructive':
                          fieldErrors[field.id],
                      }"
                    />

                    <Select
                      v-else-if="field.type === 'select'"
                      v-model="formData.content[field.id]"
                      @blur="touchedFields.add(field.id)"
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
                        <SelectItem :value="null">-- Select --</SelectItem>
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
                      <input
                        type="checkbox"
                        v-model="formData.content[field.id]"
                        @change="touchedFields.add(field.id)"
                        class="rounded border-input h-4 w-4"
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
                @click="submitReport"
                class="w-full"
                size="lg"
                :disabled="isSubmitting"
              >
                <Save class="w-4 h-4 mr-2" />
                {{ isSubmitting ? "Submitting..." : "Submit Report" }}
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
                {{ formData.title || template.name }}
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
                        v-if="formData.content[field.id]"
                        class="text-foreground"
                      >
                        {{ formData.content[field.id] }}
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
