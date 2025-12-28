<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Settings, MoreVertical, Plus } from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const organizations = ref([
  {
    id: "1",
    name: "Acme Corporation",
    slug: "acme-corp",
    description: "Leading technology solutions provider",
    logo: "/placeholder-logo.png",
    website: "https://acme.com",
    industry: "Technology",
    size: "medium",
    workspaces: [
      { id: "1", name: "Engineering", members: 12 },
      { id: "2", name: "Marketing", members: 8 },
      { id: "3", name: "Sales", members: 15 },
    ],
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "TechStart Inc",
    slug: "techstart",
    description: "Startup focused on AI solutions",
    logo: "/placeholder-logo.png",
    website: "https://techstart.io",
    industry: "Artificial Intelligence",
    size: "small",
    workspaces: [
      { id: "4", name: "Development", members: 6 },
    ],
    createdAt: new Date("2024-06-20"),
  },
]);

const sizeLabels: Record<string, string> = {
  small: "1-50 employees",
  medium: "51-200 employees",
  large: "201-500 employees",
  enterprise: "500+ employees",
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Organizations</h1>
        <p class="text-muted-foreground mt-1">Manage your organizations and workspaces</p>
      </div>
      <Button>
        <Plus class="h-4 w-4 mr-2" />
        New Organization
      </Button>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="org in organizations"
        :key="org.id"
        class="border-border hover:border-primary/50 transition-colors cursor-pointer"
      >
        <CardHeader>
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 class="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle class="text-lg">{{ org.name }}</CardTitle>
                <Badge variant="outline" class="mt-1">
                  {{ sizeLabels[org.size] || org.size }}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground mb-4">{{ org.description }}</p>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Industry</span>
              <span class="font-medium">{{ org.industry }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Workspaces</span>
              <span class="font-medium">{{ org.workspaces.length }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Total Members</span>
              <span class="font-medium">
                {{ org.workspaces.reduce((sum, ws) => sum + ws.members, 0) }}
              </span>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-border">
            <div class="flex items-center gap-2">
              <Users class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm text-muted-foreground">Workspaces</span>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <Badge v-for="ws in org.workspaces" :key="ws.id" variant="secondary">
                {{ ws.name }} ({{ ws.members }})
              </Badge>
            </div>
          </div>
          <Button variant="outline" class="w-full mt-4" size="sm">
            <Settings class="h-4 w-4 mr-2" />
            Manage
          </Button>
        </CardContent>
      </Card>

      <Card class="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center min-h-[200px]">
        <CardContent class="text-center p-6">
          <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Plus class="h-6 w-6 text-primary" />
          </div>
          <h3 class="font-semibold text-foreground">Create Organization</h3>
          <p class="text-sm text-muted-foreground mt-1">
            Start by creating your first organization
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
