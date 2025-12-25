<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, navigateTo } from "#app";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-vue-next";

const route = useRoute();
const templateId = computed(() => route.params.id);

const template = computed(() => ({
  id: templateId.value,
  name: "Daily Ward Report",
  department: "Nursing",
  description: "Daily patient care and ward status report",
  fields: [
    {
      id: 1,
      type: "text",
      label: "Ward Name",
      required: true,
      placeholder: "Enter ward name",
      section: "Basic Information",
    },
    {
      id: 2,
      type: "date",
      label: "Report Date",
      required: true,
      placeholder: "",
      section: "Basic Information",
    },
    {
      id: 3,
      type: "number",
      label: "Total Patients",
      required: true,
      placeholder: "0",
      section: "Patient Statistics",
    },
    {
      id: 4,
      type: "number",
      label: "New Admissions",
      required: true,
      placeholder: "0",
      section: "Patient Statistics",
    },
    {
      id: 5,
      type: "number",
      label: "Discharges",
      required: true,
      placeholder: "0",
      section: "Patient Statistics",
    },
    {
      id: 6,
      type: "select",
      label: "Ward Condition",
      required: true,
      options: ["Excellent", "Good", "Fair", "Poor"],
      section: "Ward Status",
    },
    {
      id: 7,
      type: "textarea",
      label: "Notable Incidents",
      required: false,
      placeholder: "Describe any incidents...",
      section: "Additional Notes",
    },
    {
      id: 8,
      type: "textarea",
      label: "Staff Notes",
      required: false,
      placeholder: "Additional notes...",
      section: "Additional Notes",
    },
    {
      id: 9,
      type: "checkbox",
      label: "All equipment functional",
      required: false,
      section: "Checklist",
    },
    {
      id: 10,
      type: "checkbox",
      label: "Adequate supplies",
      required: false,
      section: "Checklist",
    },
  ],
}));

const formData = ref<Record<number, any>>({});
const errors = ref<Record<number, string>>({});

const fieldsBySection = computed(() => {
  return template.value.fields.reduce(
    (acc, field) => {
      const section = field.section || "General";
      if (!acc[section]) acc[section] = [];
      acc[section].push(field);
      return acc;
    },
    {} as Record<string, typeof template.value.fields>,
  );
});

const validateAndSubmit = () => {
  errors.value = {};

  template.value.fields.forEach((field) => {
    if (field.required && !formData.value[field.id]) {
      errors.value[field.id] = "This field is required";
    }
  });

  if (Object.keys(errors.value).length === 0) {
    navigateTo("/reports/submitted");
  }
};

const saveDraft = () => {
  // Save draft logic
};
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="space-y-6 max-w-5xl mx-auto">
      <div class="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          @click="navigateTo('/reports/templates')"
        >
          <ArrowLeft class="h-4 w-4" />
        </Button>
        <div>
          <h1 class="text-3xl font-bold text-slate-900">{{ template.name }}</h1>
          <p class="text-slate-600 mt-1">{{ template.description }}</p>
        </div>
        <Badge
          class="bg-blue-100 text-blue-700 hover:bg-blue-100 text-base px-4 py-2"
        >
          {{ template.department }}
        </Badge>
      </div>

      <Card class="border-blue-200 bg-blue-50">
        <CardContent class="p-4">
          <div class="flex items-start gap-3">
            <AlertCircle class="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div class="text-sm text-blue-900 flex-1">
              <p class="font-semibold mb-1">Filling out: {{ template.name }}</p>
              <p>
                Fields marked with
                <span class="text-red-500 font-semibold">*</span> are required.
                Save your progress as a draft at any time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form @submit.prevent="validateAndSubmit" class="space-y-6">
        <Card v-for="(fields, section) in fieldsBySection" :key="section">
          <CardHeader class="border-b">
            <CardTitle>{{ section }}</CardTitle>
            <CardDescription
              >Complete the required fields below</CardDescription
            >
          </CardHeader>
          <CardContent class="p-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div
                v-for="field in fields"
                :key="field.id"
                :class="{ 'md:col-span-2': field.type === 'textarea' }"
                class="space-y-2"
              >
                <Label
                  :for="`field-${field.id}`"
                  class="text-slate-900 flex items-center gap-1"
                >
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </Label>

                <Input
                  v-if="field.type === 'text'"
                  :id="`field-${field.id}`"
                  v-model="formData[field.id]"
                  :placeholder="field.placeholder"
                  :class="{
                    'border-red-500 focus-visible:ring-red-500':
                      errors[field.id],
                  }"
                />

                <Input
                  v-else-if="field.type === 'number'"
                  :id="`field-${field.id}`"
                  v-model="formData[field.id]"
                  type="number"
                  :placeholder="field.placeholder"
                  :class="{
                    'border-red-500 focus-visible:ring-red-500':
                      errors[field.id],
                  }"
                />

                <Input
                  v-else-if="field.type === 'date'"
                  :id="`field-${field.id}`"
                  v-model="formData[field.id]"
                  type="date"
                  :class="{
                    'border-red-500 focus-visible:ring-red-500':
                      errors[field.id],
                  }"
                />

                <Textarea
                  v-else-if="field.type === 'textarea'"
                  :id="`field-${field.id}`"
                  v-model="formData[field.id]"
                  :placeholder="field.placeholder"
                  rows="4"
                  :class="{
                    'border-red-500 focus-visible:ring-red-500':
                      errors[field.id],
                  }"
                />

                <Select
                  v-else-if="field.type === 'select'"
                  v-model="formData[field.id]"
                >
                  <SelectTrigger
                    :id="`field-${field.id}`"
                    :class="{
                      'border-red-500 focus-visible:ring-red-500':
                        errors[field.id],
                    }"
                  >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in field.options"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div
                  v-else-if="field.type === 'checkbox'"
                  class="flex items-center gap-3 pt-2"
                >
                  <Checkbox
                    :id="`field-${field.id}`"
                    v-model:checked="formData[field.id]"
                  />
                  <Label
                    :for="`field-${field.id}`"
                    class="text-sm font-normal cursor-pointer"
                  >
                    {{ field.label }}
                  </Label>
                </div>

                <div
                  v-if="errors[field.id]"
                  class="flex items-center gap-2 text-sm text-red-600"
                >
                  <AlertCircle class="h-4 w-4" />
                  <span>{{ errors[field.id] }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 class="h-5 w-5 text-emerald-600" />
                <span>All changes are automatically saved</span>
              </div>

              <div class="flex items-center gap-3">
                <Button type="button" variant="outline" @click="saveDraft">
                  <Save class="h-4 w-4 mr-2" />
                  Save Draft
                </Button>

                <Button type="submit" class="bg-blue-600 hover:bg-blue-700">
                  <Send class="h-4 w-4 mr-2" />
                  Submit Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  </NuxtLayout>
</template>
