<script setup lang="ts">
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  SkipForwardIcon,
  Sparkles,
  SkipForward,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const templateId = route.params.templateId as string;
const reportId = route.query.reportId as string | undefined;

const { data: template, pending: templatePending } = await useLazyFetch(
  `/api/${organizationId}/templates/${templateId}`,
);

const sections = computed(() => {
  if (!template.value?.fields) return [];
  return (template.value.fields as any).sections || [];
});

const activeSectionIndex = ref(0);
const form = ref<Record<string, any>>({});
const touchedFields = ref<Set<string>>(new Set());
const isSubmitting = ref(false);

const activeSection = computed(() => sections.value[activeSectionIndex.value]);

const fieldErrors = computed(() => {
  const errors: Record<string, string> = {};
  sections.value.forEach((section: any) => {
    section.fields.forEach((field: any) => {
      if (
        field.required &&
        !form.value[field.id] &&
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
        if (form.value[field.id]) {
          filledRequired++;
        }
      }
    });
  });
  return totalRequired === 0
    ? 100
    : Math.round((filledRequired / totalRequired) * 100);
});

const nextSection = () => {
  const currentSectionFields = activeSection.value?.fields || [];
  const hasError = currentSectionFields.some((field: any) => {
    touchedFields.value.add(field.id);
    return field.required && !form.value[field.id];
  });

  if (hasError) {
    toast.error("Please fill in all required fields");
    return;
  }

  if (activeSectionIndex.value < sections.value.length - 1) {
    activeSectionIndex.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const previousSection = () => {
  if (activeSectionIndex.value > 0) {
    activeSectionIndex.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const skipFeedback = () => {
  navigateTo(`/${organizationId}/reports/submitted`);
};

const submitFeedback = async () => {
  const hasError = sections.value.some((section: any) =>
    section.fields.some((field: any) => {
      touchedFields.value.add(field.id);
      return field.required && !form.value[field.id];
    }),
  );

  if (hasError) {
    toast.error("Please fill in all required fields");
    return;
  }

  isSubmitting.value = true;
  try {
    await $fetch(`/api/${organizationId}/reports/${reportId}`, {
      method: "PUT",
      body: {
        feedback: form.value,
      },
    });
    toast.success("Feedback submitted successfully");
    navigateTo(`/${organizationId}/reports/submitted`);
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    toast.error("Failed to submit feedback");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div v-if="templatePending" class="flex items-center justify-center h-[60vh]">
    <div
      class="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"
    ></div>
  </div>

  <div v-else-if="template" class="space-y-6 max-w-4xl mx-auto">
    <div class="text-center py-8">
      <div
        class="inline-flex h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4"
      >
        <CheckCircle class="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h1 class="text-2xl font-bold mb-2">Report Submitted Successfully!</h1>
      <p class="text-muted-foreground">
        Your report has been received. Please help us improve by providing brief
        feedback.
      </p>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="flex items-center gap-2">
              <Sparkles class="h-5 w-5" />
              Feedback Form
            </CardTitle>
            <p class="text-sm text-muted-foreground mt-1">
              {{ template.name }} - {{ template.description }}
            </p>
          </div>
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
          <p class="text-muted-foreground">No feedback questions defined.</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="(section, sIndex) in sections"
            v-show="sIndex === activeSectionIndex"
            :key="section.id"
            class="space-y-4"
          >
            <div v-if="section.title" class="border-b pb-2">
              <h3 class="text-lg font-semibold">
                {{ sIndex + 1 }}. {{ section.title }}
              </h3>
            </div>

            <div class="space-y-4">
              <div
                v-for="field in section.fields"
                :key="field.id"
                class="space-y-2"
              >
                <Label class="flex items-center gap-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </Label>

                <Input
                  v-if="field.type === 'text'"
                  v-model="form[field.id]"
                  :placeholder="field.label"
                  @blur="touchedFields.add(field.id)"
                  :class="{
                    'border-destructive': fieldErrors[field.id],
                  }"
                />

                <Textarea
                  v-else-if="field.type === 'textarea'"
                  v-model="form[field.id]"
                  :placeholder="field.label"
                  rows="3"
                  @blur="touchedFields.add(field.id)"
                  :class="{
                    'border-destructive': fieldErrors[field.id],
                  }"
                />

                <Input
                  v-else-if="field.type === 'number'"
                  v-model.number="form[field.id]"
                  type="number"
                  :placeholder="field.label"
                  @blur="touchedFields.add(field.id)"
                  :class="{
                    'border-destructive': fieldErrors[field.id],
                  }"
                />

                <Select
                  v-else-if="field.type === 'select'"
                  v-model="form[field.id]"
                  @blur="touchedFields.add(field.id)"
                >
                  <SelectTrigger
                    :class="{
                      'border-destructive': fieldErrors[field.id],
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
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-6 border-t mt-6">
          <div class="flex items-center gap-2">
            <Button
              v-if="activeSectionIndex > 0"
              variant="outline"
              @click="previousSection"
            >
              <ArrowLeft class="h-4 w-4 mr-2" />
              Previous
            </Button>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="ghost" @click="skipFeedback">
              <SkipForward class="h-4 w-4 mr-2" />
              Skip
            </Button>
            <Button
              v-if="activeSectionIndex < sections.length - 1"
              @click="nextSection"
            >
              Next
              <ArrowRight class="h-4 w-4 ml-2" />
            </Button>
            <Button v-else @click="submitFeedback" :disabled="isSubmitting">
              {{ isSubmitting ? "Submitting..." : "Submit Feedback" }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
