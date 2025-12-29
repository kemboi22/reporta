<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta, navigateTo } from "#imports";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const { data: templates } = await useLazyFetch(`/api/${organizationId}/templates`, {
  key: `templates-${organizationId}`,
  transform: (data) => data || [],
});

const { data: reports } = await useLazyFetch(`/api/${organizationId}/reports`, {
  key: `reports-${organizationId}`,
  transform: (data) => data || [],
});

const showCreateDialog = ref(false);
const newTemplate = ref({
  name: "",
  description: "",
});

const createTemplate = async () => {
  try {
    await $fetch(`/api/${organizationId}/templates`, {
      method: "POST",
      body: {
        ...newTemplate.value,
        fields: [],
      },
    });
    showCreateDialog.value = false;
    newTemplate.value = {
      name: "",
      description: "",
    };
    await refreshNuxtData(`templates-${organizationId}`);
  } catch (error) {
    console.error("Failed to create template:", error);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Report Templates</h1>
        <p class="text-muted-foreground mt-1">Create and manage report templates</p>
      </div>
      <Button @click="showCreateDialog = true">
        <Plus class="h-4 w-4 mr-2" />
        New Template
      </Button>
    </div>

    <div v-if="!templates || templates.length === 0" class="text-center py-12 text-muted-foreground">
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
            <Button @click="navigateTo(`/${organizationId}/reports/fill/${template.id}`)" class="flex-1">
              Use Template
            </Button>
            <Button variant="outline" @click="navigateTo(`/${organizationId}/reports/templates/builder?templateId=${template.id}`)" class="flex-1">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  <Dialog v-model:open="showCreateDialog">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Template</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <div>
          <Label>Template Name</Label>
          <Input v-model="newTemplate.name" placeholder="Template name" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea v-model="newTemplate.description" placeholder="Template description..." rows="3" />
        </div>
        <div class="flex justify-end gap-3">
          <Button @click="createTemplate">
            Create Template
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
