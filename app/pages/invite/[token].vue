<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, XCircle, Clock, Building2 } from "lucide-vue-next";

const route = useRoute();
const token = route.params.token as string;

const isLoading = ref(true);
const error = ref<string | null>(null);
const invitation = ref<any>(null);
const isAccepting = ref(false);

const fetchInvitation = async () => {
  try {
    const data = await $fetch(`/api/invitations/${token}`);
    invitation.value = data;
  } catch (e: any) {
    error.value = e.data?.message || "Invalid or expired invitation";
  } finally {
    isLoading.value = false;
  }
};

const acceptInvitation = async () => {
  isAccepting.value = true;
  try {
    await $fetch(`/api/invitations/${token}/accept`, { method: "POST" });
    await navigateTo(`/${invitation.value.organization.id}/dashboard`);
  } catch (e: any) {
    error.value = e.data?.message || "Failed to accept invitation";
  } finally {
    isAccepting.value = false;
  }
};

onMounted(() => {
  fetchInvitation();
});

const formatExpiry = (date: string) => {
  const expiry = new Date(date);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Expired";
  return `Expires in ${days} day${days > 1 ? "s" : ""}`;
};
</script>

<template>
  <div class="min-h-screen bg-muted/30 flex items-center justify-center p-4">
    <div class="w-full max-w-lg">
      <Card v-if="isLoading" class="shadow-xl">
        <CardContent class="p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p class="mt-4 text-muted-foreground">Loading invitation...</p>
        </CardContent>
      </Card>

      <Card v-else-if="error" class="shadow-xl border-destructive">
        <CardContent class="p-12 text-center">
          <XCircle class="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-foreground mb-2">
            Invalid Invitation
          </h2>
          <p class="text-muted-foreground mb-6">
            {{ error }}
          </p>
          <Button @click="navigateTo('/auth/login')">
            Go to Login
          </Button>
        </CardContent>
      </Card>

      <Card v-else-if="invitation" class="shadow-xl">
        <CardHeader class="text-center pb-4">
          <div class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail class="h-8 w-8 text-primary" />
          </div>
          <CardTitle class="text-2xl">You're Invited!</CardTitle>
          <CardDescription class="text-base">
            Join <span class="font-semibold text-foreground">{{ invitation.organization.name }}</span>
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <Building2 class="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p class="text-sm text-muted-foreground">Organization</p>
                <p class="font-medium">{{ invitation.organization.name }}</p>
              </div>
            </div>

            <div v-if="invitation.department" class="flex items-start gap-3">
              <Building2 class="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p class="text-sm text-muted-foreground">Department</p>
                <p class="font-medium">{{ invitation.department.name }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Mail class="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p class="text-sm text-muted-foreground">Invited Email</p>
                <p class="font-medium">{{ invitation.email }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Clock class="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p class="text-sm text-muted-foreground">Status</p>
                <div class="flex items-center gap-2">
                  <CheckCircle class="h-4 w-4 text-emerald-500" />
                  <span class="font-medium">{{ formatExpiry(invitation.expiresAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="error" class="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {{ error }}
          </div>

          <Button
            @click="acceptInvitation"
            :disabled="isAccepting"
            class="w-full h-12 text-base font-semibold"
            size="lg"
          >
            <span v-if="isAccepting">Accepting...</span>
            <span v-else>Accept Invitation</span>
          </Button>

          <p class="text-xs text-center text-muted-foreground">
            By accepting this invitation, you'll join the organization as a
            {{ invitation.role.toLowerCase() }}.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
