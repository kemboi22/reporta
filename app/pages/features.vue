<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Users,
  CheckSquare,
  FileText,
  Folder,
  Bell,
  BarChart,
  Shield,
} from "lucide-vue-next";

const features = [
  {
    icon: Clock,
    title: "Smart Attendance Tracking",
    description:
      "Track employee attendance with biometric devices, real-time monitoring, and automated reporting.",
    details: [
      "Multiple device support",
      "Real-time updates",
      "Automated reports",
      "Overtime calculation",
    ],
  },
  {
    icon: Users,
    title: "Complete HR Management",
    description:
      "Manage the entire employee lifecycle from recruitment to retirement in one platform.",
    details: [
      "Staff directory",
      "Leave management",
      "Shift scheduling",
      "Performance reviews",
    ],
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description:
      "Organize work with Kanban boards, assign tasks, track progress, and meet deadlines.",
    details: [
      "Drag-and-drop boards",
      "Task assignments",
      "Due date tracking",
      "Progress monitoring",
    ],
  },
  {
    icon: FileText,
    title: "Custom Report Templates",
    description:
      "Create custom report templates with our drag-and-drop builder and manage workflows.",
    details: [
      "Template builder",
      "Dynamic forms",
      "Approval workflows",
      "Export options",
    ],
  },
  {
    icon: Folder,
    title: "Document Management",
    description:
      "Centralized repository for all documents with version control and access management.",
    details: [
      "Upload documents",
      "Version control",
      "Access permissions",
      "Document search",
    ],
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Stay informed with multi-channel notifications for important events and deadlines.",
    details: [
      "Email alerts",
      "In-app notifications",
      "Custom triggers",
      "Notification preferences",
    ],
  },
  {
    icon: BarChart,
    title: "Analytics & Insights",
    description:
      "Make data-driven decisions with real-time dashboards and comprehensive analytics.",
    details: [
      "Real-time dashboards",
      "Custom reports",
      "Trend analysis",
      "Export data",
    ],
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description:
      "Enterprise-grade security with audit trails, access controls, and compliance tools.",
    details: [
      "Data encryption",
      "Audit logs",
      "Role-based access",
      "Compliance reports",
    ],
  },
];
</script>

<template>
  <div class="min-h-screen bg-background">
    <section class="py-20 bg-muted">
      <div class="container mx-auto px-6">
        <div class="max-w-3xl mx-auto text-center mb-16">
          <h1 class="text-5xl font-bold text-foreground mb-6">
            Powerful Features
          </h1>
          <p class="text-xl text-muted-foreground">
            Everything you need to manage your workforce efficiently in one
            comprehensive platform.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card
            v-for="feature in features"
            :key="feature.title"
            class="hover:shadow-lg transition-shadow"
          >
            <CardContent class="p-6">
              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <component :is="feature.icon" class="w-6 h-6 text-blue-600" />
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-semibold text-foreground mb-2">
                    {{ feature.title }}
                  </h3>
                  <p class="text-muted-foreground mb-4">
                    {{ feature.description }}
                  </p>
                  <ul class="space-y-2">
                    <li
                      v-for="detail in feature.details"
                      :key="detail"
                      class="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <div class="w-1 h-1 rounded-full bg-blue-600"></div>
                      {{ detail }}
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <section class="py-20">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold text-foreground mb-6">
          Ready to Get Started?
        </h2>
        <p class="text-xl text-muted-foreground mb-8">
          Start your 14-day free trial today. No credit card required.
        </p>
        <Button size="lg" @click="navigateTo('/onboarding/step-1')"
          >Start Free Trial</Button
        >
      </div>
    </section>
  </div>
</template>
