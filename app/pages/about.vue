<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Target, Award } from "lucide-vue-next";

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "Enterprise-grade security protecting your data 24/7",
  },
  {
    icon: Users,
    title: "Customer Focused",
    description: "Built with feedback from 10,000+ organizations",
  },
  {
    icon: Target,
    title: "Innovation Driven",
    description: "Constantly evolving with latest technology",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to delivering exceptional quality",
  },
];

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Emma Wilson",
    role: "Head of Product",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "David Rodriguez",
    role: "Head of Engineering",
    image: "/placeholder.svg?height=200&width=200",
  },
];
</script>

<template>
  <div class="min-h-screen bg-white">
    <nav class="border-b border-slate-200">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="w-9 h-9 bg-blue-600 rounded-lg"></div>
            <span class="text-xl font-semibold">WorkForce Pro</span>
          </NuxtLink>
          <Button variant="ghost" size="sm" @click="navigateTo('/')"
            >Back to Home</Button
          >
        </div>
      </div>
    </nav>

    <section class="py-20 bg-slate-50">
      <div class="container mx-auto px-6">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-5xl font-bold text-slate-900 mb-6">
            About WorkForce Pro
          </h1>
          <p class="text-xl text-slate-600 leading-relaxed">
            We're on a mission to transform how organizations manage their
            workforce operations with intelligent, workspace-based tools that
            make complex tasks simple and efficient.
          </p>
        </div>
      </div>
    </section>

    <section class="py-20">
      <div class="container mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <h2 class="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <p class="text-slate-600 mb-4">
              Founded in 2020, WorkForce Pro was born from the frustration of
              using multiple disconnected tools to manage workforce operations.
              We believed there had to be a better way.
            </p>
            <p class="text-slate-600">
              Today, we serve over 10,000 organizations worldwide, helping them
              streamline attendance tracking, task management, HR operations,
              and compliance reporting in one unified platform.
            </p>
          </div>
          <div
            class="bg-slate-100 rounded-2xl p-8 aspect-square flex items-center justify-center"
          >
            <img
              src="/placeholder.svg?height=400&width=400"
              alt="Our Story"
              class="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-slate-50">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
          <p class="text-xl text-slate-600">What drives us every day</p>
        </div>

        <div class="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card v-for="value in values" :key="value.title">
            <CardContent class="p-6 text-center">
              <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4"
              >
                <component :is="value.icon" class="w-6 h-6 text-blue-600" />
              </div>
              <h3 class="font-semibold text-slate-900 mb-2">
                {{ value.title }}
              </h3>
              <p class="text-sm text-slate-600">{{ value.description }}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <section class="py-20">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
          <p class="text-xl text-slate-600">The people behind WorkForce Pro</p>
        </div>

        <div class="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div v-for="member in team" :key="member.name" class="text-center">
            <img
              :src="member.image"
              :alt="member.name"
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 class="font-semibold text-slate-900">{{ member.name }}</h3>
            <p class="text-sm text-slate-600">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-blue-600 text-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-6">Join Us on Our Journey</h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Ready to transform your workforce management? Start your free trial
          today.
        </p>
        <Button
          size="lg"
          variant="secondary"
          @click="navigateTo('/onboarding/step-1')"
        >
          Get Started Free
        </Button>
      </div>
    </section>
  </div>
</template>
