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

const filteredCampaigns = computed(() => {
  return campaigns.value.filter((c) => {
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchUrl = c.safe_page_url?.toLowerCase().includes(q);
      const matchFilter = c.filter_filename?.toLowerCase().includes(q);
      if (!matchName && !matchUrl && !matchFilter) return false;
    }

    if (statusFilter.value === "active" && !c.active) return false;
    if (statusFilter.value === "inactive" && c.active) return false;

    if (platformFilter.value !== "all") {
      if (!c.platform || !c.platform.includes(platformFilter.value)) return false;
    }

    return true;
  });
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-white">
          Campaigns
        </h1>
        <p class="text-zinc-400 text-xs mt-0.5">
          Manage routing rules, device filters, and safe destinations.
        </p>
      </div>

      <RouterLink
        to="/new"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-colors self-start sm:self-auto"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14"/><path d="M12 5v14"/>
        </svg>
        <span>New Campaign</span>
      </RouterLink>
    </div>

    <!-- Minimal Stats Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="p-4 rounded-lg border border-zinc-800 bg-zinc-950">
        <span class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">Total Campaigns</span>
        <span class="text-2xl font-bold font-mono text-white mt-1 block">{{ totalCampaigns }}</span>
      </div>

      <div class="p-4 rounded-lg border border-zinc-800 bg-zinc-950">
        <span class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">Active Routers</span>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-2xl font-bold font-mono text-white">{{ activeCampaigns }}</span>
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      </div>

      <div class="p-4 rounded-lg border border-zinc-800 bg-zinc-950">
        <span class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">Target Platforms</span>
        <span class="text-2xl font-bold font-mono text-white mt-1 block">{{ uniquePlatformsCount }}</span>
      </div>

      <div class="p-4 rounded-lg border border-zinc-800 bg-zinc-950">
        <span class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">Target Geos</span>
        <span class="text-2xl font-bold font-mono text-white mt-1 block">{{ uniqueRegionsCount }}</span>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="p-3 rounded-lg border border-zinc-800 bg-zinc-950 flex flex-col md:flex-row items-center justify-between gap-3">
      <div class="relative w-full md:w-72">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search campaigns..."
          class="w-full px-3 py-1.5 rounded bg-black border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
        />
      </div>

      <div class="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto text-xs">
        <div class="flex p-0.5 rounded bg-black border border-zinc-800 text-[11px]">
          <button
            @click="statusFilter = 'all'"
            :class="[
              'px-2.5 py-1 rounded transition-colors',
              statusFilter === 'all'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-white'
            ]"
          >
            All ({{ campaigns.length }})
          </button>
          <button
            @click="statusFilter = 'active'"
            :class="[
              'px-2.5 py-1 rounded transition-colors',
              statusFilter === 'active'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-white'
            ]"
          >
            Active ({{ activeCampaigns }})
          </button>
          <button
            @click="statusFilter = 'inactive'"
            :class="[
              'px-2.5 py-1 rounded transition-colors',
              statusFilter === 'inactive'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-zinc-400 hover:text-white'
            ]"
          >
            Inactive
          </button>
        </div>

        <select
          v-model="platformFilter"
          class="px-2.5 py-1 rounded bg-black border border-zinc-800 text-zinc-300 text-xs focus:outline-none focus:border-zinc-500 cursor-pointer"
        >
          <option value="all">All Platforms</option>
          <option value="mac">macOS</option>
          <option value="windows">Windows</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
        </select>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 2" :key="i" class="h-24 rounded-lg border border-zinc-800/80 bg-zinc-950 animate-pulse"></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredCampaigns.length === 0"
      class="p-12 text-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 text-xs space-y-3"
    >
      <p class="text-zinc-300">No campaigns found.</p>
      <RouterLink
        to="/new"
        class="inline-block px-3 py-1.5 rounded bg-white text-black font-semibold text-xs hover:bg-zinc-200"
      >
        Create Campaign
      </RouterLink>
    </div>

    <!-- Campaign Cards List -->
    <div v-else class="space-y-3">
      <div
        v-for="c in filteredCampaigns"
        :key="c.id"
        class="p-5 rounded-lg border border-zinc-800/90 bg-zinc-950 hover:border-zinc-700 transition-colors"
      >
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <!-- Metadata -->
          <div class="space-y-2 flex-1 min-w-0">
            <div class="flex items-center gap-2.5 flex-wrap">
              <RouterLink
                :to="`/campaign/${c.id}`"
                class="text-sm font-semibold text-white hover:underline"
              >
                {{ c.name }}
              </RouterLink>

              <span class="text-[11px] font-mono text-zinc-500">
                #{{ c.id }}
              </span>

              <!-- Status Dot -->
              <span class="inline-flex items-center gap-1.5 text-[11px] text-zinc-400">
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="c.active ? 'bg-emerald-500' : 'bg-zinc-600'"
                ></span>
                {{ c.active ? "Active" : "Inactive" }}
              </span>

              <!-- Filter Filename -->
              <span class="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {{ c.filter_filename }}
              </span>
            </div>

            <!-- Safe URL -->
            <div class="text-xs text-zinc-400 flex items-center gap-1.5 truncate">
              <span class="text-zinc-500">Safe:</span>
              <a
                :href="c.safe_page_url"
                target="_blank"
                rel="noopener"
                class="text-zinc-300 hover:text-white hover:underline truncate max-w-md"
              >
                {{ c.safe_page_url }}
              </a>
            </div>

            <!-- Targeting Chips -->
            <div class="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span
                v-for="p in c.platform"
                :key="p"
                class="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 capitalize"
              >
                {{ p }}
              </span>

              <span class="text-zinc-700">·</span>

              <template v-if="c.allowed_regions && c.allowed_regions.length > 0">
                <span
                  v-for="r in c.allowed_regions.slice(0, 4)"
                  :key="r"
                  class="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono"
                >
                  {{ r }}
                </span>
                <span
                  v-if="c.allowed_regions.length > 4"
                  class="text-zinc-500"
                >
                  +{{ c.allowed_regions.length - 4 }}
                </span>
              </template>
              <span v-else class="text-zinc-500 italic">
                All Regions
              </span>

              <span class="text-zinc-700">·</span>

              <span class="text-zinc-400">
                Cookie: {{ c.cookie_days }}d
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0 text-xs">
            <RouterLink
              :to="`/campaign/${c.id}/analytics`"
              class="px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            >
              Analytics
            </RouterLink>

            <RouterLink
              :to="`/campaign/${c.id}/setup`"
              class="px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            >
              Setup
            </RouterLink>

            <a
              :href="downloadBundleUrl(c.id)"
              class="px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            >
              ZIP
            </a>

            <RouterLink
              :to="`/campaign/${c.id}`"
              class="px-3 py-1.5 rounded bg-white hover:bg-zinc-200 text-black font-semibold transition-colors"
            >
              Details
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
