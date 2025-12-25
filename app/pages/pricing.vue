<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-vue-next";

const plans = [
  {
    name: "Starter",
    price: "29",
    description: "Perfect for small teams",
    features: [
      "Up to 50 employees",
      "Basic attendance tracking",
      "Task management",
      "Email support",
      "5GB storage",
    ],
  },
  {
    name: "Professional",
    price: "79",
    description: "For growing organizations",
    popular: true,
    features: [
      "Up to 200 employees",
      "Advanced HR management",
      "Custom reports",
      "Priority support",
      "50GB storage",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Unlimited employees",
      "All features included",
      "Dedicated support",
      "Unlimited storage",
      "Custom integrations",
      "SLA guarantee",
    ],
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
        <div class="max-w-3xl mx-auto text-center mb-16">
          <h1 class="text-5xl font-bold text-slate-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p class="text-xl text-slate-600">
            Choose the perfect plan for your organization. All plans include a
            14-day free trial.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card
            v-for="plan in plans"
            :key="plan.name"
            :class="plan.popular ? 'border-blue-600 shadow-xl' : ''"
          >
            <CardHeader>
              <div class="flex items-center justify-between mb-4">
                <CardTitle class="text-2xl">{{ plan.name }}</CardTitle>
                <Badge v-if="plan.popular" variant="default">Popular</Badge>
              </div>
              <CardDescription>{{ plan.description }}</CardDescription>
              <div class="mt-4">
                <span class="text-4xl font-bold text-slate-900"
                  >${{ plan.price }}</span
                >
                <span v-if="plan.price !== 'Custom'" class="text-slate-600"
                  >/month</span
                >
              </div>
            </CardHeader>
            <CardContent>
              <ul class="space-y-3">
                <li
                  v-for="feature in plan.features"
                  :key="feature"
                  class="flex items-start gap-2"
                >
                  <Check class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span class="text-slate-600">{{ feature }}</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                :variant="plan.popular ? 'default' : 'outline'"
                class="w-full"
                @click="navigateTo('/onboarding/step-1')"
              >
                {{
                  plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"
                }}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>
