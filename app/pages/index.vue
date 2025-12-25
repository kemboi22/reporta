<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    title: "Smart Attendance",
    description: "Biometric tracking with real-time monitoring",
    color: "text-blue-600",
  },
  {
    icon: Users,
    title: "HR Management",
    description: "Complete employee lifecycle management",
    color: "text-emerald-600",
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Kanban boards and progress tracking",
    color: "text-purple-600",
  },
  {
    icon: FileText,
    title: "Smart Reports",
    description: "Custom templates with drag-and-drop",
    color: "text-amber-600",
  },
  {
    icon: Folder,
    title: "Documents",
    description: "Centralized repository with version control",
    color: "text-rose-600",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Multi-channel alerts and reminders",
    color: "text-indigo-600",
  },
  {
    icon: BarChart,
    title: "Analytics",
    description: "Real-time dashboards and insights",
    color: "text-cyan-600",
  },
  {
    icon: Shield,
    title: "Compliance",
    description: "Audit trails and security controls",
    color: "text-slate-600",
  },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "500K+", label: "Tasks Managed" },
  { value: "50+", label: "Countries" },
];
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Improved navigation bar -->
    <nav
      class="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50"
    >
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-3">
            <div
              class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center"
            >
              <Shield class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-semibold text-slate-900"
              >WorkForce Pro</span
            >
          </NuxtLink>

          <div class="hidden md:flex items-center gap-6">
            <NuxtLink
              to="/features"
              class="text-sm font-medium text-slate-600 hover:text-slate-900"
              >Features</NuxtLink
            >
            <NuxtLink
              to="/pricing"
              class="text-sm font-medium text-slate-600 hover:text-slate-900"
              >Pricing</NuxtLink
            >
            <NuxtLink
              to="/about"
              class="text-sm font-medium text-slate-600 hover:text-slate-900"
              >About</NuxtLink
            >
            <NuxtLink
              to="/contact"
              class="text-sm font-medium text-slate-600 hover:text-slate-900"
              >Contact</NuxtLink
            >
          </div>

          <div class="flex items-center gap-3">
            <Button variant="ghost" size="sm" @click="navigateTo('/auth/login')"
              >Sign In</Button
            >
            <Button size="sm" @click="navigateTo('/onboarding/step-1')"
              >Get Started</Button
            >
          </div>
        </div>
      </div>
    </nav>

    <!-- Enhanced hero section -->
    <section class="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" class="mb-6">
            <span class="relative flex h-2 w-2 mr-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2 w-2 bg-blue-600"
              ></span>
            </span>
            AI-Powered Workforce Management
          </Badge>

          <h1
            class="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight"
          >
            Complete Operations Management Platform
          </h1>

          <p class="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Streamline attendance, tasks, HR operations, and compliance
            reporting in one powerful workspace-based platform.
          </p>

          <div class="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              @click="navigateTo('/onboarding/step-1')"
              class="h-12 px-8"
            >
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" class="h-12 px-8">
              Watch Demo
            </Button>
          </div>

          <p class="text-sm text-slate-500 mt-6">
            14-day free trial • No credit card • Cancel anytime
          </p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-slate-50">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-slate-900 mb-4">
            Everything You Need
          </h2>
          <p class="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed for modern workforce management
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            v-for="feature in features"
            :key="feature.title"
            class="border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
          >
            <CardContent class="p-6">
              <div class="mb-4">
                <div
                  :class="[
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    feature.color.replace('text-', 'bg-').replace('600', '100'),
                  ]"
                >
                  <component
                    :is="feature.icon"
                    :class="['w-6 h-6', feature.color]"
                  />
                </div>
              </div>
              <h3 class="text-lg font-semibold text-slate-900 mb-2">
                {{ feature.title }}
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                {{ feature.description }}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-24">
      <div class="container mx-auto px-6">
        <Card class="border-none bg-blue-600 text-white">
          <CardContent class="p-12">
            <div class="text-center mb-12">
              <h2 class="text-4xl font-bold mb-4">
                Trusted by Organizations Worldwide
              </h2>
              <p class="text-blue-100 text-lg">
                Join thousands of companies managing their workforce better
              </p>
            </div>

            <div class="grid md:grid-cols-4 gap-8">
              <div class="text-center" v-for="stat in stats" :key="stat.label">
                <div class="text-5xl font-bold mb-2">{{ stat.value }}</div>
                <div class="text-blue-100 text-sm uppercase tracking-wide">
                  {{ stat.label }}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-24 bg-slate-50">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p class="text-xl text-slate-600">
            Get started in minutes, not hours
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div class="text-center">
            <div
              class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
            >
              1
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">Sign Up</h3>
            <p class="text-slate-600">
              Create your organization account in under 2 minutes
            </p>
          </div>
          <div class="text-center">
            <div
              class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
            >
              2
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">
              Add Your Team
            </h3>
            <p class="text-slate-600">
              Import staff, set departments, and configure workflows
            </p>
          </div>
          <div class="text-center">
            <div
              class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
            >
              3
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">
              Start Managing
            </h3>
            <p class="text-slate-600">
              Track attendance, assign tasks, and generate reports
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 border-t border-slate-200">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold text-slate-900 mb-6">
          Ready to Transform Your Operations?
        </h2>
        <p class="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Start your 14-day free trial. No credit card required.
        </p>
        <Button
          size="lg"
          @click="navigateTo('/onboarding/step-1')"
          class="bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 text-lg"
        >
          Get Started Free
        </Button>
      </div>
    </section>

    <!-- Improved footer -->
    <footer class="bg-slate-900 text-slate-400 py-12">
      <div class="container mx-auto px-6">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <span class="text-lg font-semibold text-white"
                >WorkForce Pro</span
              >
            </div>
            <p class="text-sm">
              Modern workforce management for the digital age.
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3">Product</h4>
            <div class="space-y-2 text-sm">
              <NuxtLink to="/features" class="block hover:text-white"
                >Features</NuxtLink
              >
              <NuxtLink to="/pricing" class="block hover:text-white"
                >Pricing</NuxtLink
              >
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3">Company</h4>
            <div class="space-y-2 text-sm">
              <NuxtLink to="/about" class="block hover:text-white"
                >About</NuxtLink
              >
              <NuxtLink to="/contact" class="block hover:text-white"
                >Contact</NuxtLink
              >
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3">Legal</h4>
            <div class="space-y-2 text-sm">
              <a href="#" class="block hover:text-white">Privacy</a>
              <a href="#" class="block hover:text-white">Terms</a>
            </div>
          </div>
        </div>
        <div class="border-t border-slate-800 pt-8 text-center text-sm">
          © 2025 WorkForce Pro. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>
