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
  if (route.path.endsWith("/setup")) return "Setup Guide";
  if (campaignId.value) return "Details";
  return "";
});
</script>

<template>
  <div class="min-h-screen bg-[#060911] text-slate-100 relative flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
    <!-- Ambient Background Effects -->
    <div class="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0"></div>
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-gradient pointer-events-none z-0"></div>

    <!-- Top Navigation Header -->
    <header class="sticky top-0 z-40 backdrop-blur-xl bg-[#0b101d]/80 border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Brand / Logo -->
        <div class="flex items-center gap-6">
          <RouterLink to="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div class="w-full h-full bg-[#0b101d] rounded-[11px] flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  CLOAKSHIELD
                </span>
                <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  STUDIO
                </span>
              </div>
              <p class="text-[11px] text-slate-400 leading-tight">Dynamic Cloaking & Traffic Router</p>
            </div>
          </RouterLink>

          <!-- Divider -->
          <div class="hidden md:block h-6 w-px bg-white/10"></div>

          <!-- Main Nav Tabs -->
          <nav class="hidden sm:flex items-center gap-1">
            <RouterLink
              to="/"
              :class="[
                'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
                isList
                  ? 'bg-white/10 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              ]"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              <span>Campaigns</span>
            </RouterLink>
          </nav>
        </div>

        <!-- Right Side Nav Actions -->
        <div class="flex items-center gap-4">
          <!-- Backend Status Badge -->
          <div class="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="font-medium tracking-wide">Engine Live</span>
          </div>

          <!-- New Campaign CTA Button -->
          <RouterLink
            to="/new"
            :class="[
              'relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md',
              isNew
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/50'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5'
            ]"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
            <span>New Campaign</span>
          </RouterLink>
        </div>
      </div>

      <!-- Subheader / Breadcrumbs bar -->
      <div v-if="campaignId || isNew" class="border-t border-white/5 bg-[#090e1a]/60 px-4 sm:px-6 lg:px-8 py-2 text-xs text-slate-400 flex items-center gap-2">
        <div class="max-w-7xl mx-auto w-full flex items-center gap-2">
          <RouterLink to="/" class="hover:text-slate-200 transition-colors flex items-center gap-1">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Campaigns</span>
          </RouterLink>

          <span class="text-slate-600">/</span>

          <span v-if="isNew" class="text-indigo-400 font-medium">New Campaign Builder</span>

          <template v-else-if="campaignId">
            <RouterLink :to="`/campaign/${campaignId}`" class="hover:text-slate-200 transition-colors">
              Campaign #{{ campaignId }}
            </RouterLink>
            <template v-if="subPage">
              <span class="text-slate-600">/</span>
              <span class="text-indigo-400 font-medium">{{ subPage }}</span>
            </template>
          </template>
        </div>
      </div>
    </header>

    <!-- Main View Content Area -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <RouterView />
    </main>

    <!-- Global Toast Notifications Container -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl backdrop-blur-xl border shadow-xl text-sm font-medium transition-all duration-300 animate-slide-up"
        :class="[
          toast.type === 'error'
            ? 'bg-rose-950/90 border-rose-500/30 text-rose-200 shadow-rose-950/50'
            : toast.type === 'info'
            ? 'bg-slate-900/90 border-slate-700 text-slate-200 shadow-slate-950/50'
            : 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200 shadow-emerald-950/50'
        ]"
      >
        <div class="flex items-center gap-2">
          <svg v-if="toast.type === 'error'" class="w-4 h-4 text-rose-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <svg v-else class="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>{{ toast.message }}</span>
        </div>
        <button
          @click="remove(toast.id)"
          class="text-slate-400 hover:text-white p-1 rounded transition-colors"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-white/5 bg-[#070b14]/90 py-6 text-center text-xs text-slate-500 relative z-10">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 CloakShield Studio. Multi-Tiered Cloaking & Traffic Distribution Engine.</p>
        <div class="flex items-center gap-6 text-slate-400">
          <span class="hover:text-slate-300">FastAPI Backend</span>
          <span>•</span>
          <span class="hover:text-slate-300">PHP 7.4+ Cloak Core</span>
          <span>•</span>
          <span class="hover:text-slate-300">Edge Classification</span>
        </div>
      </div>
    </footer>
  </div>
</template>
