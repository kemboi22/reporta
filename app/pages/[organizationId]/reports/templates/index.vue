<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { NuxtLink } from "#components";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const { data: templates } = await useLazyFetch(
  `/api/${organizationId}/templates`,
  {
    key: `templates-${organizationId}`,
    transform: (data) => data || [],
  },
);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Report Templates</h1>
        <p class="text-muted-foreground mt-1">
          Create and manage report templates
        </p>
      </div>
      <Button
        :as="NuxtLink"
        :to="`/${organizationId}/reports/templates/builder`"
      >
        <Plus class="h-4 w-4 mr-2" />
        New Template
      </Button>
    </div>

    <div
      v-if="!templates || templates.length === 0"
      class="text-center py-12 text-muted-foreground"
    >
      No templates yet. Create one above.
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="template in templates" :key="template.id">
        <CardContent class="p-6 space-y-4">
          <div class="hover:shadow-lg transition-all">
            <div class="flex flex-col gap-4">
              <div class="flex-1 space-y-2">
                <h3 class="font-semibold">{{ template.name }}</h3>
                <p class="text-sm text-muted-foreground">
                  {{ template.description || "No description" }}
                </p>
              </div>
              <Badge>{{ template.isActive ? "Active" : "Inactive" }}</Badge>
            </div>
          </div>
          <div class="flex gap-2">
            <Button
              @click="
                navigateTo(`/${organizationId}/reports/fill/${template.id}`)
              "
              class="flex-1"
            >
              Use Template
            </Button>
            <Button
              variant="outline"
              @click="
                navigateTo(
                  `/${organizationId}/reports/templates/builder?templateId=${template.id}`,
                )
              "
              class="flex-1"
            >
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
