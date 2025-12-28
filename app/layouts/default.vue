<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-background">
    <Toaster />
    <LayoutsAppNavbar />
    <div>
      <slot />
    </div>
    <LayoutsAppFooter />
  </div>
</template>
