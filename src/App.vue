<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink, RouterView } from "vue-router";
import { useToast } from "./composables/useToast";

const route = useRoute();
const { toasts, remove } = useToast();

const isNew = computed(() => route.path === "/new");
const isList = computed(() => route.path === "/");
const campaignId = computed(() => route.params.id as string | undefined);

const subPage = computed(() => {
  if (route.path.endsWith("/analytics")) return "Analytics";
  if (route.path.endsWith("/setup")) return "Setup";
  if (campaignId.value) return "Overview";
  return "";
});
</script>

<template>
  <div class="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
    <!-- Clean Minimalist Header -->
    <header class="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-zinc-800">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <!-- Brand / Monotone Logo -->
        <div class="flex items-center gap-6">
          <RouterLink to="/" class="flex items-center gap-2.5 group">
            <div class="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-200 group-hover:border-zinc-500 transition-colors">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span class="font-bold text-sm tracking-tight text-white">
              CLOAKSHIELD
            </span>
          </RouterLink>

          <!-- Nav Links -->
          <nav class="flex items-center gap-1">
            <RouterLink
              to="/"
              :class="[
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                isList ? 'text-white bg-zinc-900' : 'text-zinc-400 hover:text-zinc-200'
              ]"
            >
              Campaigns
            </RouterLink>
          </nav>
        </div>

        <!-- Right Side Nav Actions -->
        <div class="flex items-center gap-3">
          <!-- Minimalist Status Indicator -->
          <div class="flex items-center gap-1.5 px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 text-[11px] text-zinc-400">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Live</span>
          </div>

          <!-- Minimal High-Contrast Button -->
          <RouterLink
            to="/new"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-colors shadow-sm"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            <span>New Campaign</span>
          </RouterLink>
        </div>
      </div>

      <!-- Clean Minimal Breadcrumb Bar -->
      <div v-if="campaignId || isNew" class="border-t border-zinc-800/80 bg-zinc-950 px-4 sm:px-6 py-1.5 text-xs text-zinc-400">
        <div class="max-w-6xl mx-auto flex items-center gap-1.5 text-[11px]">
          <RouterLink to="/" class="hover:text-zinc-200 transition-colors">
            Campaigns
          </RouterLink>

          <span class="text-zinc-600">/</span>

          <span v-if="isNew" class="text-zinc-200 font-medium">New Campaign</span>

          <template v-else-if="campaignId">
            <RouterLink :to="`/campaign/${campaignId}`" class="hover:text-zinc-200 transition-colors">
              Campaign #{{ campaignId }}
            </RouterLink>
            <template v-if="subPage">
              <span class="text-zinc-600">/</span>
              <span class="text-zinc-200 font-medium">{{ subPage }}</span>
            </template>
          </template>
        </div>
      </div>
    </header>

    <!-- Main View Content Area -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
      <RouterView />
    </main>

    <!-- Global Toast Notifications -->
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl text-xs font-medium text-zinc-200"
      >
        <div class="flex items-center gap-2">
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'"
          ></span>
          <span>{{ toast.message }}</span>
        </div>
        <button
          @click="remove(toast.id)"
          class="text-zinc-500 hover:text-zinc-300 p-0.5"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Minimalist Monotone Footer -->
    <footer class="border-t border-zinc-800/80 bg-black py-5 text-center text-[11px] text-zinc-500">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>CloakShield Studio · Traffic Routing & Protection</p>
        <p class="text-zinc-600">FastAPI · PHP Filter · Edge Router</p>
      </div>
    </footer>
  </div>
</template>
