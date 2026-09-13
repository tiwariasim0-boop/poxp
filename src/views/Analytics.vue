<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import {
  getAnalyticsSummary,
  getAnalyticsTimeline,
  getRecentEvents,
  getCampaign,
  type Campaign,
} from "../api/campaigns";
import { useToast } from "../composables/useToast";

const props = defineProps<{ id: string }>();

const campaign = ref<Campaign | null>(null);
const summary = ref<any>(null);
const timeline = ref<any[]>([]);
const recent = ref<any[]>([]);
const loading = ref(true);
const daysRange = ref(7);
const searchQuery = ref("");
const verdictFilter = ref<"all" | "human" | "bot">("all");
const hoveredIndex = ref<number | null>(null);

const { success } = useToast();

async function loadData() {
  loading.value = true;
  try {
    const [c, s, t, r] = await Promise.all([
      getCampaign(props.id).catch(() => null),
      getAnalyticsSummary(props.id, daysRange.value).catch(() => ({
        total: 0,
        human: 0,
        bot: 0,
        human_rate: 0,
      })),
      getAnalyticsTimeline(props.id, daysRange.value).catch(() => []),
      getRecentEvents(props.id).catch(() => []),
    ]);
    campaign.value = c;
    summary.value = s;
    timeline.value = t;
    recent.value = r;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});

// Chart calculations
const maxTraffic = computed(() => {
  if (!timeline.value || timeline.value.length === 0) return 10;
  const max = Math.max(
    ...timeline.value.map((d) => (d.human || 0) + (d.bot || 0))
  );
  return max > 0 ? max : 10;
});

// Filtered Events
const filteredEvents = computed(() => {
  return recent.value.filter((e) => {
    if (verdictFilter.value !== "all" && e.verdict !== verdictFilter.value) {
      return false;
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const ua = (e.user_agent || "").toLowerCase();
      const ip = (e.ip || "").toLowerCase();
      const country = (e.country || "").toLowerCase();
      if (!ua.includes(q) && !ip.includes(q) && !country.includes(q)) {
        return false;
      }
    }
    return true;
  });
});
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-16">
    <!-- Header with Campaign Backlink and Refresh -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-xs text-slate-400">
          <RouterLink :to="`/campaign/${id}`" class="hover:text-indigo-400 transition-colors">
            ← Back to {{ campaign?.name || 'Campaign #' + id }}
          </RouterLink>
        </div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>Traffic Intelligence & Analytics</span>
          <span class="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Realtime
          </span>
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <!-- Days Range Selector -->
        <div class="flex p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
          <button
            v-for="d in [7, 14, 30]"
            :key="d"
            @click="daysRange = d; loadData()"
            :class="[
              'px-3 py-1.5 rounded-lg transition-colors font-medium',
              daysRange === d
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            ]"
          >
            Last {{ d }}d
          </button>
        </div>

        <button
          @click="loadData(); success('Analytics refreshed')"
          class="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
          title="Refresh metrics"
        >
          <svg class="w-4 h-4" :class="loading ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 4 KPI Metrics Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Requests -->
      <div class="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Scanned</span>
          <div class="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-2xl sm:text-3xl font-bold font-mono text-white">
            {{ summary?.total ?? 0 }}
          </div>
          <p class="text-xs text-slate-500 mt-1">Inbound HTTP requests</p>
        </div>
      </div>

      <!-- Human Visitors -->
      <div class="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Human Visitors</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
            {{ summary?.human ?? 0 }}
          </div>
          <p class="text-xs text-emerald-400/80 mt-1">Routed to Money Pages</p>
        </div>
      </div>

      <!-- Bot / Crawler Interceptions -->
      <div class="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Bot Shielded</span>
          <div class="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-2xl sm:text-3xl font-bold font-mono text-rose-400">
            {{ summary?.bot ?? 0 }}
          </div>
          <p class="text-xs text-rose-400/80 mt-1">Trapped in Safe Page</p>
        </div>
      </div>

      <!-- Human Conversion Rate -->
      <div class="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Human Rate</span>
          <div class="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/>
            </svg>
          </div>
        </div>
        <div class="mt-3">
          <div class="text-2xl sm:text-3xl font-bold font-mono text-cyan-300">
            {{ summary?.human_rate ?? 0 }}%
          </div>
          <!-- Mini Progress Bar -->
          <div class="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              class="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              :style="{ width: `${Math.min(100, summary?.human_rate || 0)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visual SVG Traffic Timeline Chart -->
    <div class="glass-panel rounded-2xl p-6 shadow-xl space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <span>Traffic Classification Timeline</span>
            <span class="text-xs font-normal text-slate-400">({{ daysRange }} Days)</span>
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">
            Daily distribution of allowed humans vs blocked crawlers
          </p>
        </div>

        <!-- Legend -->
        <div class="flex items-center gap-4 text-xs">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50"></span>
            <span class="text-slate-300">Human Visitors</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500/50"></span>
            <span class="text-slate-300">Bots & Crawlers</span>
          </div>
        </div>
      </div>

      <!-- Chart Body -->
      <div v-if="timeline.length > 0" class="space-y-4">
        <div class="h-64 flex items-end gap-3 pt-6 px-2 relative border-b border-white/10">
          <div
            v-for="(point, idx) in timeline"
            :key="point.date"
            class="flex-1 flex flex-col items-center h-full justify-end group relative"
            @mouseenter="hoveredIndex = idx"
            @mouseleave="hoveredIndex = null"
          >
            <!-- Hover Tooltip -->
            <div
              v-if="hoveredIndex === idx"
              class="absolute -top-12 z-20 px-3 py-1.5 rounded-lg bg-slate-900/95 border border-white/10 text-xs shadow-xl text-center whitespace-nowrap animate-slide-up pointer-events-none"
            >
              <div class="font-bold text-white">{{ point.date }}</div>
              <div class="text-emerald-400">Humans: {{ point.human }}</div>
              <div class="text-rose-400">Bots: {{ point.bot }}</div>
            </div>

            <!-- Stacked Bars -->
            <div class="w-full max-w-[48px] flex flex-col justify-end gap-1 h-full pb-1">
              <!-- Bot Bar Segment -->
              <div
                class="w-full rounded-t bg-rose-500/80 hover:bg-rose-400 transition-all duration-200"
                :style="{ height: `${Math.max(4, ((point.bot || 0) / maxTraffic) * 100)}%` }"
                :title="`Bots: ${point.bot}`"
              ></div>
              <!-- Human Bar Segment -->
              <div
                class="w-full rounded-t bg-emerald-500/80 hover:bg-emerald-400 transition-all duration-200 shadow-sm shadow-emerald-500/20"
                :style="{ height: `${Math.max(4, ((point.human || 0) / maxTraffic) * 100)}%` }"
                :title="`Humans: ${point.human}`"
              ></div>
            </div>

            <!-- Date Label -->
            <span class="text-[10px] font-mono text-slate-400 mt-2 rotate-[-25deg] sm:rotate-0 truncate max-w-full">
              {{ point.date.split('-').slice(1).join('/') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty Timeline Message -->
      <div v-else class="py-12 text-center text-slate-400 space-y-2">
        <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-slate-300">No traffic history recorded yet for this period.</p>
        <p class="text-xs text-slate-500">Upload your generated filter files to your safe page server to begin capturing analytics.</p>
      </div>
    </div>

    <!-- Recent Events Stream Log -->
    <div class="glass-panel rounded-2xl p-6 shadow-xl space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 class="text-base font-bold text-white">Realtime Traffic Stream</h2>
          <p class="text-xs text-slate-400 mt-0.5">Inspection logs and classification verdicts</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Search filter -->
          <div class="relative w-full sm:w-56">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search UA, IP, country..."
              class="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#060912] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <svg class="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>

          <!-- Verdict buttons -->
          <div class="flex p-0.5 rounded-lg bg-black/40 border border-white/10 text-xs">
            <button
              @click="verdictFilter = 'all'"
              :class="[
                'px-2.5 py-1 rounded-md transition-colors',
                verdictFilter === 'all'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              ]"
            >
              All
            </button>
            <button
              @click="verdictFilter = 'human'"
              :class="[
                'px-2.5 py-1 rounded-md transition-colors',
                verdictFilter === 'human'
                  ? 'bg-emerald-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              ]"
            >
              Humans
            </button>
            <button
              @click="verdictFilter = 'bot'"
              :class="[
                'px-2.5 py-1 rounded-md transition-colors',
                verdictFilter === 'bot'
                  ? 'bg-rose-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              ]"
            >
              Bots
            </button>
          </div>
        </div>
      </div>

      <!-- Events Table -->
      <div v-if="filteredEvents.length > 0" class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10 pb-2">
            <tr>
              <th class="py-3 px-3">Timestamp</th>
              <th class="py-3 px-3">Verdict</th>
              <th class="py-3 px-3">Country</th>
              <th class="py-3 px-3">IP Address</th>
              <th class="py-3 px-3">Client User-Agent</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 font-mono">
            <tr
              v-for="e in filteredEvents"
              :key="e.id"
              class="hover:bg-white/[0.02] transition-colors"
            >
              <td class="py-3 px-3 text-slate-400 whitespace-nowrap">
                {{ new Date(e.timestamp).toLocaleTimeString() }}
                <span class="text-[10px] text-slate-600 block">
                  {{ new Date(e.timestamp).toLocaleDateString() }}
                </span>
              </td>

              <!-- Verdict Pill -->
              <td class="py-3 px-3 whitespace-nowrap">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full font-bold uppercase text-[10px] border inline-flex items-center gap-1.5',
                    e.verdict === 'human'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                  ]"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="e.verdict === 'human' ? 'bg-emerald-400' : 'bg-rose-400'"
                  ></span>
                  {{ e.verdict }}
                </span>
              </td>

              <!-- Country -->
              <td class="py-3 px-3 whitespace-nowrap font-bold text-slate-200">
                <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {{ e.country || 'GLOBAL' }}
                </span>
              </td>

              <!-- IP -->
              <td class="py-3 px-3 text-slate-400 whitespace-nowrap">
                {{ e.ip || '—' }}
              </td>

              <!-- UA -->
              <td class="py-3 px-3 text-slate-400 max-w-md truncate font-sans text-xs" :title="e.user_agent">
                {{ e.user_agent }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State for Recent Events -->
      <div v-else class="py-12 text-center text-slate-400 space-y-2">
        <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-slate-300">
          {{ recent.length === 0 ? "Awaiting inbound visitor traffic." : "No traffic matching your filters." }}
        </p>
        <p class="text-xs text-slate-500">
          Events will appear in real time as requests hit your cloaked endpoint.
        </p>
      </div>
    </div>
  </div>
</template>
