<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-vue-next";

const name = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");
const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Handle form submission
  isSubmitting.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-background">
    <nav class="border-b border-border">
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

    <section class="py-20 bg-muted">
      <div class="container mx-auto px-6">
        <div class="max-w-3xl mx-auto text-center mb-16">
          <h1 class="text-5xl font-bold text-foreground mb-6">Get In Touch</h1>
          <p class="text-xl text-muted-foreground">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div class="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription
                  >Fill out the form below and we'll get back to you
                  shortly</CardDescription
                >
              </CardHeader>
              <CardContent>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <Label for="name">Name</Label>
                      <Input
                        id="name"
                        v-model="name"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div class="space-y-2">
                      <Label for="email">Email</Label>
                      <Input
                        id="email"
                        v-model="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <Label for="subject">Subject</Label>
                    <Input
                      id="subject"
                      v-model="subject"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <Label for="message">Message</Label>
                    <Textarea
                      id="message"
                      v-model="message"
                      placeholder="Tell us more..."
                      rows="5"
                      required
                    />
                  </div>
                  <Button type="submit" class="w-full" :disabled="isSubmitting">
                    {{ isSubmitting ? "Sending..." : "Send Message" }}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div class="space-y-6">
            <Card>
              <CardContent class="p-6">
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <Mail class="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-foreground mb-1">Email</h3>
                    <p class="text-sm text-muted-foreground">
                      support@workforcepro.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent class="p-6">
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <Phone class="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-foreground mb-1">Phone</h3>
                    <p class="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent class="p-6">
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <MapPin class="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-foreground mb-1">Office</h3>
                    <p class="text-sm text-muted-foreground">
                      123 Business Ave<br />San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
