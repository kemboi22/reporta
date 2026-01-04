<script setup lang="ts">
import { ref, computed } from "vue";
import { definePageMeta, navigateTo } from "#imports";
import {
  CreditCard,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Package,
  Zap,
  ArrowRight,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { canManageBilling } from "~/utils";

definePageMeta({
  layout: "dashboard",
});

if (!canManageBilling()) {
  const route = useRoute();
  const orgId = route.params.organizationId as string;
  navigateTo(`/${orgId}/dashboard`);
}

const currentPlan = ref({
  name: "Enterprise",
  price: 299,
  billing: "monthly",
  users: 50,
  usersUsed: 42,
  storage: 500,
  storageUsed: 342,
  features: ["Unlimited projects", "Priority support", "Advanced analytics", "Custom integrations", "API access"],
});

const usagePercentage = computed(() => Math.round((currentPlan.value.usersUsed / currentPlan.value.users) * 100));
const storagePercentage = computed(() => Math.round((currentPlan.value.storageUsed / currentPlan.value.storage) * 100));

const invoices = ref([
  { id: 1, number: "INV-2024-001", date: "Dec 01, 2024", amount: 299, status: "paid" },
  { id: 2, number: "INV-2024-002", date: "Nov 01, 2024", amount: 299, status: "paid" },
  { id: 3, number: "INV-2024-003", date: "Oct 01, 2024", amount: 299, status: "paid" },
  { id: 4, number: "INV-2024-004", date: "Sep 01, 2024", amount: 299, status: "paid" },
]);

const paymentMethods = ref([
  { id: 1, type: "visa", last4: "4242", expiry: "12/26", isDefault: true },
  { id: 2, type: "mastercard", last4: "8888", expiry: "06/25", isDefault: false },
]);

const plans = [
  { name: "Starter", price: 29, users: 10, storage: 50, features: ["5 projects", "Basic analytics", "Email support"] },
  { name: "Professional", price: 99, users: 25, storage: 200, features: ["Unlimited projects", "Advanced analytics", "Priority support", "API access"] },
  { name: "Enterprise", price: 299, users: 50, storage: 500, features: ["Unlimited projects", "Priority support", "Advanced analytics", "Custom integrations", "API access"] },
];
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Billing & Subscription</h1>
      <p class="text-muted-foreground mt-1">Manage your subscription and payment methods</p>
    </div>

    <Tabs default-value="overview" class="w-full">
      <TabsList class="grid w-full md:w-auto md:inline-grid grid-cols-4 bg-muted/50">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="plans">Plans</TabsTrigger>
        <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" class="space-y-4">
        <Card>
          <CardContent class="p-6">
            <div class="flex items-start justify-between mb-6">
              <div>
                <Badge variant="default" class="mb-2">Current Plan</Badge>
                <h2 class="text-3xl font-bold text-foreground">{{ currentPlan.name }}</h2>
                <div class="flex items-baseline gap-1 mt-2">
                  <span class="text-4xl font-bold text-foreground">${{ currentPlan.price }}</span>
                  <span class="text-muted-foreground">/{{ currentPlan.billing }}</span>
                </div>
              </div>
              <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap class="h-8 w-8 text-white" />
              </div>
            </div>
            <div class="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <Calendar class="h-4 w-4" />
              <span>Next billing date: Jan 01, 2025</span>
            </div>
            <div class="flex gap-3">
              <Button variant="outline">Change Plan</Button>
              <Button>Manage Subscription</Button>
            </div>
          </CardContent>
        </Card>

        <div class="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">User Usage</CardTitle>
              <CardDescription>{{ currentPlan.usersUsed }} of {{ currentPlan.users }} users</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress :value="usagePercentage" class="mb-2" />
              <p class="text-sm text-muted-foreground">{{ usagePercentage }}% used</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Storage Usage</CardTitle>
              <CardDescription>{{ currentPlan.storageUsed }}GB of {{ currentPlan.storage }}GB</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress :value="storagePercentage" class="mb-2" />
              <p class="text-sm text-muted-foreground">{{ storagePercentage }}% used</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Included Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid md:grid-cols-2 gap-3">
              <div v-for="feature in currentPlan.features" :key="feature" class="flex items-center gap-2 text-sm">
                <CheckCircle2 class="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span class="text-foreground">{{ feature }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="plans" class="space-y-4">
        <div class="grid md:grid-cols-3 gap-6">
          <Card v-for="plan in plans" :key="plan.name" :class="currentPlan.name === plan.name && 'ring-2 ring-primary ring-offset-2'">
            <CardContent class="p-6">
              <h3 class="text-xl font-bold text-foreground mb-2">{{ plan.name }}</h3>
              <div class="flex items-baseline gap-1 mb-4">
                <span class="text-4xl font-bold text-foreground">${{ plan.price }}</span>
                <span class="text-muted-foreground">/month</span>
              </div>
              <div class="space-y-2 mb-6">
                <div class="flex items-center gap-2 text-sm">
                  <Package class="h-4 w-4 text-muted-foreground" />
                  <span class="text-foreground">{{ plan.users }} users</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <Zap class="h-4 w-4 text-muted-foreground" />
                  <span class="text-foreground">{{ plan.storage }}GB storage</span>
                </div>
              </div>
              <div class="space-y-2 mb-6">
                <div v-for="feature in plan.features" :key="feature" class="flex items-start gap-2 text-sm">
                  <CheckCircle2 class="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span class="text-foreground">{{ feature }}</span>
                </div>
              </div>
              <Button :variant="currentPlan.name === plan.name ? 'outline' : 'default'" class="w-full">
                {{ currentPlan.name === plan.name ? 'Current Plan' : 'Upgrade' }}
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="payment" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment options</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div v-for="method in paymentMethods" :key="method.id" class="flex items-center justify-between p-4 rounded-lg border" :class="method.isDefault && 'bg-muted/30'">
                <div class="flex items-center gap-3">
                  <div class="h-12 w-20 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    <CreditCard class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div class="font-medium text-foreground">**** {{ method.last4 }}</div>
                    <div class="text-sm text-muted-foreground">Expires {{ method.expiry }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <Badge v-if="method.isDefault" variant="default" class="text-xs">Default</Badge>
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <MoreVertical class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Button variant="outline" class="w-full mt-4">
              <Plus class="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-2 text-sm">
              <p class="text-foreground">Acme Corporation</p>
              <p class="text-muted-foreground">123 Business Street</p>
              <p class="text-muted-foreground">San Francisco, CA 94105</p>
              <p class="text-muted-foreground">United States</p>
            </div>
            <Button variant="outline" class="w-full mt-4">Edit Address</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="invoices" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>Download and manage your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div v-for="invoice in invoices" :key="invoice.id" class="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                    <Package class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 class="font-medium text-foreground">{{ invoice.number }}</h4>
                    <p class="text-sm text-muted-foreground">{{ invoice.date }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <p class="font-medium text-foreground">${{ invoice.amount }}</p>
                    <Badge :variant="invoice.status === 'paid' ? 'default' : 'outline'" :class="invoice.status === 'paid' ? 'bg-emerald-500 hover:bg-emerald-600' : ''" class="text-xs">
                      {{ invoice.status }}
                    </Badge>
                  </div>
                  <Button variant="outline" size="icon" class="h-9 w-9">
                    <Download class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <Card v-if="usagePercentage > 80 || storagePercentage > 80" class="border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20">
      <CardContent class="p-4">
        <div class="flex items-start gap-3">
          <AlertTriangle class="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 class="font-medium text-foreground">Usage Warning</h4>
            <p class="text-sm text-muted-foreground mt-1">You're approaching your plan limits. Consider upgrading to avoid service interruptions.</p>
            <Button variant="outline" size="sm" class="mt-3">
              Upgrade Plan
              <ArrowRight class="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
