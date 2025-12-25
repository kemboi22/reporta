<script setup lang="ts">
import { definePageMeta } from "#imports"; // Import definePageMeta from '#imports'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Plug,
  Shield,
  CreditCard,
  Users,
  Bell,
  Palette,
  Globe,
} from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const settingsCategories = [
  {
    title: "Organization",
    description: "Manage organization details, branding, and working hours",
    icon: Building2,
    href: "/settings/organization",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Integrations",
    description: "Connect biometric devices, email, SMS, and calendar sync",
    icon: Plug,
    href: "/settings/integrations",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Security",
    description: "Authentication, IP restrictions, and audit logging",
    icon: Shield,
    href: "/settings/security",
    color: "bg-red-100 text-red-600",
  },
  {
    title: "Billing",
    description: "Manage subscription, usage, and payment methods",
    icon: CreditCard,
    href: "/settings/billing",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "User Management",
    description: "Add users, manage roles, and permissions",
    icon: Users,
    href: "/settings/users",
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Notifications",
    description: "Configure alert rules and notification preferences",
    icon: Bell,
    href: "/notifications/settings",
    color: "bg-indigo-100 text-indigo-600",
  },
];
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Settings</h1>
      <p class="text-slate-600 mt-1">Manage your workspace configuration</p>
    </div>

    <!-- Settings Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="category in settingsCategories"
        :key="category.title"
        class="hover:shadow-md transition-all cursor-pointer group"
        @click="navigateTo(category.href)"
      >
        <CardHeader>
          <div class="flex items-start gap-4">
            <div
              :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center',
                category.color,
              ]"
            >
              <component :is="category.icon" class="h-6 w-6" />
            </div>
            <div class="flex-1">
              <CardTitle class="group-hover:text-blue-600 transition-colors">
                {{ category.title }}
              </CardTitle>
              <CardDescription class="mt-2">
                {{ category.description }}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>
