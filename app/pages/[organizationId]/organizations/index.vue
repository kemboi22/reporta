<script setup lang="ts">
import { definePageMeta, navigateTo } from "#imports";
import {
  Building2,
  Users,
  Settings,
  MoreVertical,
  Plus,
} from "lucide-vue-next";
import { NuxtLink } from "#components";
import { isAdmin } from "~/utils";

definePageMeta({
  layout: "dashboard",
});

if (!isAdmin()) {
  navigateTo(`/${organizationId}/dashboard`);
}

const route = useRoute();
const organizationId = route.params.organizationId as string;

const { data: organizations, refresh: refreshOrganizations } =
  await useLazyFetch("/api/organizations", {
    key: "organizations",
    transform: (data) => data || [],
  });

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
        <p class="text-muted-foreground mt-1">
          Manage your organizations and teams
        </p>
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
              <div
                class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
              >
                <Building2 class="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle class="text-lg">{{ org.name }}</CardTitle>
                <Badge variant="outline" class="mt-1">
                  {{ org.slug || "organization" }}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground mb-4">
            {{ org.description || "No description" }}
          </p>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Your Role</span>
              <Badge variant="secondary">{{
                org.users?.[0]?.role || "MEMBER"
              }}</Badge>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Workspaces</span>
              <span class="font-medium">{{ org.workspaces?.length || 0 }}</span>
            </div>
            <div
              class="flex items-center justify-between text-sm"
              v-if="org.size"
            >
              <span class="text-muted-foreground">Size</span>
              <span class="font-medium">{{
                sizeLabels[org.size] || org.size
              }}</span>
            </div>
          </div>
          <Button
            variant="outline"
            class="w-full mt-4"
            size="sm"
            :as="NuxtLink"
            :to="`/${org.id}/dashboard`"
          >
            <Settings class="h-4 w-4 mr-2" />
            Manage
          </Button>
        </CardContent>
      </Card>

      <Card
        class="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center min-h-[200px]"
      >
        <CardContent class="text-center p-6">
          <div
            class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3"
          >
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
