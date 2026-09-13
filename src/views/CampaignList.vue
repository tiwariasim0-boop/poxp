<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { listCampaigns, downloadBundleUrl, type Campaign } from "../api/campaigns";

const campaigns = ref<Campaign[]>([]);
const loading = ref(true);
const searchQuery = ref("");
const statusFilter = ref<"all" | "active" | "inactive">("all");
const platformFilter = ref<string>("all");

onMounted(async () => {
  try {
    campaigns.value = await listCampaigns();
  } catch (err) {
    console.error("Failed to load campaigns", err);
  } finally {
    loading.value = false;
  }
});

// Computed Metrics
const totalCampaigns = computed(() => campaigns.value.length);
const activeCampaigns = computed(
  () => campaigns.value.filter((c) => c.active).length
);
const uniquePlatformsCount = computed(() => {
  const set = new Set<string>();
  campaigns.value.forEach((c) => c.platform?.forEach((p) => set.add(p)));
  return set.size;
});
const uniqueRegionsCount = computed(() => {
  const set = new Set<string>();
  campaigns.value.forEach((c) => c.allowed_regions?.forEach((r) => set.add(r)));
  return set.size;
});

// Filtered Campaigns
const filteredCampaigns = computed(() => {
  return campaigns.value.filter((c) => {
    // Search filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchUrl = c.safe_page_url?.toLowerCase().includes(q);
      const matchFilter = c.filter_filename?.toLowerCase().includes(q);
      if (!matchName && !matchUrl && !matchFilter) return false;
    }

    // Status filter
    if (statusFilter.value === "active" && !c.active) return false;
    if (statusFilter.value === "inactive" && c.active) return false;

    // Platform filter
    if (platformFilter.value !== "all") {
      if (!c.platform || !c.platform.includes(platformFilter.value)) return false;
    }

    return true;
  });
});
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Top Hero / Metrics Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <span>Campaign Operations</span>
          <span class="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {{ campaigns.length }} Active Routing Nodes
          </span>
        </h1>
        <p class="text-slate-400 text-sm mt-1">
          Manage cloaked campaigns, device-specific traffic routing, and real-time safe/money filters.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <RouterLink
          to="/new"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
          </svg>
          <span>Create Campaign</span>
        </RouterLink>
      </div>
    </div>

    <!-- Quick Stats Cards Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Stat 1 -->
      <div class="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">Total Campaigns</span>
          <div class="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-bold font-mono text-white">{{ totalCampaigns }}</span>
          <span class="text-xs text-slate-400">deployed</span>
        </div>
      </div>

      <!-- Stat 2 -->
      <div class="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">Live Traffic Routers</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">{{ activeCampaigns }}</span>
          <span class="text-xs text-emerald-400/80">active</span>
        </div>
      </div>

      <!-- Stat 3 -->
      <div class="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">Target Platforms</span>
          <div class="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">{{ uniquePlatformsCount }}</span>
          <span class="text-xs text-slate-400">OS variants</span>
        </div>
      </div>

      <!-- Stat 4 -->
      <div class="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">Geos Targeted</span>
          <div class="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-bold font-mono text-violet-300">{{ uniqueRegionsCount }}</span>
          <span class="text-xs text-slate-400">countries</span>
        </div>
      </div>
    </div>

    <!-- Search & Filter Controls Bar -->
    <div class="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
      <!-- Search Input -->
      <div class="relative w-full md:w-80">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, URL, or filter..."
          class="w-full pl-9 pr-4 py-2 rounded-xl bg-[#060912] border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
        <svg class="w-4 h-4 text-slate-500 absolute left-3 top-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>

      <!-- Filters Group -->
      <div class="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto text-xs">
        <!-- Status Filter -->
        <div class="flex p-1 rounded-xl bg-black/40 border border-white/10">
          <button
            @click="statusFilter = 'all'"
            :class="[
              'px-3 py-1.5 rounded-lg transition-colors capitalize font-medium',
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            ]"
          >
            All ({{ campaigns.length }})
          </button>
          <button
            @click="statusFilter = 'active'"
            :class="[
              'px-3 py-1.5 rounded-lg transition-colors capitalize font-medium',
              statusFilter === 'active'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            ]"
          >
            Active ({{ activeCampaigns }})
          </button>
          <button
            @click="statusFilter = 'inactive'"
            :class="[
              'px-3 py-1.5 rounded-lg transition-colors capitalize font-medium',
              statusFilter === 'inactive'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            ]"
          >
            Inactive
          </button>
        </div>

        <!-- Platform Filter Dropdown -->
        <select
          v-model="platformFilter"
          class="px-3 py-2 rounded-xl bg-[#060912] border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="all">All Platforms</option>
          <option value="mac">macOS</option>
          <option value="windows">Windows</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
        </select>
      </div>
    </div>

    <!-- Loading State Skeleton -->
    <div v-if="loading" class="grid gap-4">
      <div
        v-for="i in 3"
        :key="i"
        class="glass-card rounded-2xl p-6 border border-white/5 shimmer-mask animate-pulse"
      >
        <div class="flex justify-between items-start">
          <div class="space-y-3 w-1/2">
            <div class="h-5 bg-white/10 rounded w-48"></div>
            <div class="h-3 bg-white/5 rounded w-72"></div>
            <div class="flex gap-2">
              <div class="h-6 w-16 bg-white/5 rounded-full"></div>
              <div class="h-6 w-20 bg-white/5 rounded-full"></div>
            </div>
          </div>
          <div class="h-8 w-24 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredCampaigns.length === 0"
      class="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4"
    >
      <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-bold text-white">No campaigns found</h3>
        <p class="text-sm text-slate-400 mt-1">
          {{ searchQuery ? "No campaigns matched your search criteria." : "You haven't configured any cloaked campaigns yet." }}
        </p>
      </div>
      <RouterLink
        to="/new"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
      >
        + Build Your First Campaign
      </RouterLink>
    </div>

    <!-- Campaign Cards List -->
    <div v-else class="grid gap-4">
      <div
        v-for="c in filteredCampaigns"
        :key="c.id"
        class="glass-card rounded-2xl p-6 border border-white/10 hover:border-indigo-500/40 transition-all duration-200 group"
      >
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <!-- Left: Campaign Metadata -->
          <div class="space-y-3 flex-1 min-w-0">
            <div class="flex items-center gap-3 flex-wrap">
              <RouterLink
                :to="`/campaign/${c.id}`"
                class="text-lg font-bold text-white hover:text-indigo-400 transition-colors flex items-center gap-2"
              >
                <span>{{ c.name }}</span>
                <span class="text-xs font-mono text-slate-400 font-normal">#{{ c.id }}</span>
              </RouterLink>

              <!-- Status Beacon -->
              <span
                :class="[
                  'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border',
                  c.active
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                ]"
              >
                <span class="relative flex h-2 w-2">
                  <span v-if="c.active" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2" :class="c.active ? 'bg-emerald-500' : 'bg-slate-500'"></span>
                </span>
                {{ c.active ? "Active" : "Inactive" }}
              </span>

              <!-- Filter Filename badge -->
              <span class="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5">
                filter: <strong class="text-slate-200">{{ c.filter_filename }}</strong>
              </span>
            </div>

            <!-- Safe URL preview -->
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span>Safe Page:</span>
              <a
                :href="c.safe_page_url"
                target="_blank"
                rel="noopener"
                class="text-indigo-300 hover:text-indigo-200 hover:underline truncate max-w-md flex items-center gap-1"
              >
                <span>{{ c.safe_page_url }}</span>
                <svg class="w-3 h-3 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>

            <!-- Targeting Tags: Platforms & Regions -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <!-- Platform Badges -->
              <div class="flex items-center gap-1">
                <span
                  v-for="p in c.platform"
                  :key="p"
                  class="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10"
                >
                  {{ p }}
                </span>
              </div>

              <span class="text-slate-600">•</span>

              <!-- Regions Badges -->
              <div class="flex items-center gap-1">
                <template v-if="c.allowed_regions && c.allowed_regions.length > 0">
                  <span
                    v-for="r in c.allowed_regions.slice(0, 4)"
                    :key="r"
                    class="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    {{ r }}
                  </span>
                  <span
                    v-if="c.allowed_regions.length > 4"
                    class="text-[11px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-white/5"
                  >
                    +{{ c.allowed_regions.length - 4 }} more
                  </span>
                </template>
                <span v-else class="text-[11px] text-slate-400 italic">
                  All Regions Allowed
                </span>
              </div>

              <span class="text-slate-600">•</span>

              <!-- Fail mode & Cookie days -->
              <span class="text-[11px] text-slate-400">
                Fail mode: <strong class="text-slate-300 uppercase">{{ c.fail_mode }}</strong>
              </span>
              <span class="text-slate-600">•</span>
              <span class="text-[11px] text-slate-400">
                Cookie: <strong class="text-slate-300">{{ c.cookie_days }}d</strong>
              </span>
            </div>
          </div>

          <!-- Right: Action Toolbar -->
          <div class="flex items-center gap-2 shrink-0">
            <RouterLink
              :to="`/campaign/${c.id}/analytics`"
              class="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 hover:text-white text-slate-300 text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              <span>Analytics</span>
            </RouterLink>

            <RouterLink
              :to="`/campaign/${c.id}/setup`"
              class="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 hover:text-white text-slate-300 text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              <span>Setup Guide</span>
            </RouterLink>

            <a
              :href="downloadBundleUrl(c.id)"
              class="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors flex items-center gap-1.5"
              title="Download full campaign package ZIP"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>ZIP</span>
            </a>

            <RouterLink
              :to="`/campaign/${c.id}`"
              class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1"
            >
              <span>Details</span>
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
