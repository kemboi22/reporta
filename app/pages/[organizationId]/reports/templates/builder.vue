<script setup lang="ts">
import { NuxtLink } from "#components";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Eye,
  GripVertical,
  Type,
  List,
  CheckSquare,
  Calendar,
  Hash,
  FileText,
} from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const templateName = ref("");
const templateDescription = ref("");
const department = ref("");
const frequency = ref("");
const isActive = ref(true);

const fields = ref([
  {
    id: 1,
    type: "text",
    label: "Patient Name",
    required: true,
    placeholder: "Enter patient name",
  },
  {
    id: 2,
    type: "number",
    label: "Patient ID",
    required: true,
    placeholder: "Enter ID",
  },
  {
    id: 3,
    type: "date",
    label: "Report Date",
    required: true,
    placeholder: "",
  },
]);

const fieldTypes = [
  { value: "text", label: "Text Input", icon: Type },
  { value: "textarea", label: "Long Text", icon: FileText },
  { value: "number", label: "Number", icon: Hash },
  { value: "date", label: "Date", icon: Calendar },
  { value: "select", label: "Dropdown", icon: List },
  { value: "checkbox", label: "Checkbox", icon: CheckSquare },
];

const addField = () => {
  fields.value.push({
    id: Date.now(),
    type: "text",
    label: "",
    required: false,
    placeholder: "",
  });
};

const removeField = (id: number) => {
  fields.value = fields.value.filter((f) => f.id !== id);
};

const saveTemplate = () => {
  console.log("[v0] Saving template", {
    templateName: templateName.value,
    fields: fields.value,
  });
  navigateTo("/reports/templates");
};

const getFieldIcon = (type: string) => {
  const field = fieldTypes.find((f) => f.value === type);
  return field?.icon || Type;
};

const draggedItem = ref<number | null>(null);

const onDragStart = (id: number) => {
  draggedItem.value = id;
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const onDrop = (targetId: number) => {
  if (draggedItem.value === null) return;

  const draggedIndex = fields.value.findIndex(
    (f) => f.id === draggedItem.value,
  );
  const targetIndex = fields.value.findIndex((f) => f.id === targetId);

  if (draggedIndex !== -1 && targetIndex !== -1) {
    const newFields = [...fields.value];
    const [removed] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, removed);
    fields.value = newFields;
  }

  draggedItem.value = null;
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          :as="NuxtLink"
          to="/reports/templates"
        >
          <ArrowLeft class="h-4 w-4" />
        </Button>
        <div>
          <h1 class="text-3xl font-bold text-foreground">Template Builder</h1>
          <p class="text-muted-foreground mt-1">
            Create a custom report template
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <Button variant="outline" class="border-border">
          <Eye class="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          class="bg-blue-600 hover:bg-blue-700 text-white"
          @click="saveTemplate"
        >
          <Save class="h-4 w-4 mr-2" />
          Save Template
        </Button>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Template Settings -->
      <div class="lg:col-span-1 space-y-6">
        <Card class="border-border">
          <CardContent class="p-6 space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">
                Template Settings
              </h3>

              <div class="space-y-4">
                <div>
                  <Label for="name">Template Name</Label>
                  <Input
                    id="name"
                    v-model="templateName"
                    placeholder="e.g., Daily Ward Report"
                    class="mt-1.5"
                  />
                </div>

                <div>
                  <Label for="description">Description</Label>
                  <Textarea
                    id="description"
                    v-model="templateDescription"
                    placeholder="Brief description of this report..."
                    rows="3"
                    class="mt-1.5"
                  />
                </div>

                <div>
                  <Label for="department">Department</Label>
                  <Select v-model="department">
                    <SelectTrigger id="department" class="mt-1.5">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nursing">Nursing</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label for="frequency">Frequency</Label>
                  <Select v-model="frequency">
                    <SelectTrigger id="frequency" class="mt-1.5">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="ondemand">On-Demand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="flex items-center justify-between pt-2">
                  <div>
                    <Label>Active Status</Label>
                    <p class="text-sm text-muted-foreground">
                      Make template available
                    </p>
                  </div>
                  <Switch v-model:checked="isActive" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Field Types -->
        <Card class="border-border">
          <CardContent class="p-6">
            <h3 class="text-sm font-semibold text-foreground mb-4">
              Available Field Types
            </h3>
            <div class="space-y-2">
              <div
                v-for="fieldType in fieldTypes"
                :key="fieldType.value"
                class="flex items-center gap-3 text-sm text-muted-foreground p-2 rounded-lg hover:bg-muted"
              >
                <component
                  :is="fieldType.icon"
                  class="h-4 w-4 text-muted-foreground"
                />
                <span>{{ fieldType.label }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Form Builder -->
      <div class="lg:col-span-2 space-y-4">
        <Card class="border-border">
          <CardContent class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-semibold text-foreground">
                  Form Fields
                </h3>
                <p class="text-sm text-muted-foreground mt-1">
                  Drag and drop to reorder fields
                </p>
              </div>
              <Button variant="outline" size="sm" @click="addField">
                <Plus class="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            <!-- Made fields draggable -->
            <div class="space-y-4">
              <Card
                v-for="field in fields"
                :key="field.id"
                class="border-border bg-muted cursor-move"
                draggable="true"
                @dragstart="onDragStart(field.id)"
                @dragover="onDragOver"
                @drop="onDrop(field.id)"
              >
                <CardContent class="p-4">
                  <div class="flex gap-4">
                    <div class="flex items-start pt-8 cursor-move">
                      <GripVertical class="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div class="flex-1 grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Field Type</Label>
                        <Select v-model="field.type">
                          <SelectTrigger class="mt-1.5 bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              v-for="ft in fieldTypes"
                              :key="ft.value"
                              :value="ft.value"
                            >
                              {{ ft.label }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Field Label</Label>
                        <Input
                          v-model="field.label"
                          placeholder="Enter field label"
                          class="mt-1.5 bg-background"
                        />
                      </div>

                      <div>
                        <Label>Placeholder Text</Label>
                        <Input
                          v-model="field.placeholder"
                          placeholder="Enter placeholder"
                          class="mt-1.5 bg-background"
                        />
                      </div>

                      <div class="flex items-end gap-4">
                        <div class="flex items-center gap-2">
                          <Switch v-model:checked="field.required" />
                          <Label class="text-sm">Required</Label>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-start pt-8">
                      <Button
                        variant="ghost"
                        size="sm"
                        class="text-red-600 hover:text-red-700 hover:bg-red-50"
                        @click="removeField(field.id)"
                      >
                        <Trash2 class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div
                v-if="fields.length === 0"
                class="text-center py-12 text-muted-foreground"
              >
                <FileText
                  class="h-12 w-12 mx-auto mb-3 text-muted-foreground"
                />
                <p class="font-medium">No fields yet</p>
                <p class="text-sm">
                  Click "Add Field" to start building your form
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
