<script setup lang="ts">
import "vue-sonner/style.css";
const sidebarCollapsed = ref(false);
</script>
<template>
  <div class="min-h-screen bg-background">
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <Sidebar
        :collapsed="sidebarCollapsed"
        @toggle="sidebarCollapsed = !sidebarCollapsed"
      />

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Navigation -->
        <TopNav @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
        <Toaster />

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-6">
          <slot />
        </main>
      </div>
    </div>

    <!-- Floating Pending Items -->
    <PendingItems />
  </div>
</template>
