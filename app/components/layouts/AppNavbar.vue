<script setup lang="ts">
import { Shield, Menu, X } from "lucide-vue-next";
import { NuxtLink } from "#components";

const mobileMenuOpen = ref(false);

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Features",
    href: "/features",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

// Close mobile menu when navigating
const navigateToLink = (href: string) => {
  mobileMenuOpen.value = false;
  navigateTo(href);
};
</script>
<template>
  <!-- Improved navigation bar -->
  <nav
    class="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50"
  >
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div
            class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center"
          >
            <Shield class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-semibold text-foreground"
            >WorkForce Pro</span
          >
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-6">
          <NuxtLink
            v-for="link in links"
            :key="link.href"
            :to="link.href"
            class="text-sm font-medium text-muted-foreground hover:text-foreground"
            >{{ link.name }}</NuxtLink
          >
        </div>

        <!-- Desktop CTA Buttons -->
        <div class="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button :as="NuxtLink" variant="ghost" size="sm" to="/auth/login"
            >Sign In</Button
          >
          <Button :as="NuxtLink" size="sm" to="/onboarding/step-1"
            >Get Started</Button
          >
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2"
          >
            <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </Button>
        </div>
      </div>
      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-4 pt-4 border-t border-border"
      >
        <div class="flex flex-col space-y-4">
          <NuxtLink
            v-for="link in links"
            :key="link.href"
            :to="link.href"
            @click="navigateToLink(link.href)"
            class="text-sm font-medium text-muted-foreground hover:text-foreground py-2"
            >{{ link.name }}</NuxtLink
          >
          <div class="flex flex-col space-y-3 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              :as="NuxtLink"
              to="/auth/login"
              class="justify-start cursor-pointer"
              >Sign In</Button
            >
            <Button
              size="sm"
              :as="NuxtLink"
              to="/onboarding/step-1"
              class="justify-start cursor-pointer"
              >Get Started</Button
            >
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
