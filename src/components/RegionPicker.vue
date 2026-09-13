<script setup lang="ts">
import { ref, computed } from "vue";

interface RegionInfo {
  code: string;
  name: string;
  flag: string;
  tier: 1 | 2;
  region: "NA" | "EU" | "APAC" | "LATAM" | "ME";
}

const ALL_REGIONS: RegionInfo[] = [
  { code: "US", name: "United States", flag: "🇺🇸", tier: 1, region: "NA" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", tier: 1, region: "EU" },
  { code: "CA", name: "Canada", flag: "🇨🇦", tier: 1, region: "NA" },
  { code: "AU", name: "Australia", flag: "🇦🇺", tier: 1, region: "APAC" },
  { code: "DE", name: "Germany", flag: "🇩🇪", tier: 1, region: "EU" },
  { code: "FR", name: "France", flag: "🇫🇷", tier: 2, region: "EU" },
  { code: "IT", name: "Italy", flag: "🇮🇹", tier: 2, region: "EU" },
  { code: "ES", name: "Spain", flag: "🇪🇸", tier: 2, region: "EU" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", tier: 2, region: "EU" },
  { code: "JP", name: "Japan", flag: "🇯🇵", tier: 2, region: "APAC" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", tier: 2, region: "APAC" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", tier: 2, region: "APAC" },
  { code: "IN", name: "India", flag: "🇮🇳", tier: 2, region: "APAC" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", tier: 2, region: "LATAM" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", tier: 2, region: "LATAM" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", tier: 2, region: "ME" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", tier: 2, region: "ME" },
];

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    variant?: "allow" | "block";
  }>(),
  {
    variant: "allow",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const searchQuery = ref("");

const filteredRegions = computed(() => {
  if (!searchQuery.value.trim()) return ALL_REGIONS;
  const q = searchQuery.value.toLowerCase().trim();
  return ALL_REGIONS.filter(
    (r) => r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)
  );
});

function toggle(code: string) {
  const next = props.modelValue.includes(code)
    ? props.modelValue.filter((v) => v !== code)
    : [...props.modelValue, code];
  emit("update:modelValue", next);
}

function selectTier1() {
  const tier1Codes = ALL_REGIONS.filter((r) => r.tier === 1).map((r) => r.code);
  emit("update:modelValue", Array.from(new Set([...props.modelValue, ...tier1Codes])));
}

function selectEurope() {
  const euCodes = ALL_REGIONS.filter((r) => r.region === "EU").map((r) => r.code);
  emit("update:modelValue", Array.from(new Set([...props.modelValue, ...euCodes])));
}

function selectAll() {
  emit("update:modelValue", ALL_REGIONS.map((r) => r.code));
}

function clearAll() {
  emit("update:modelValue", []);
}
</script>

<template>
  <div class="space-y-3 rounded-xl border border-white/10 bg-slate-900/40 p-4">
    <!-- Header with Quick Filter Presets and Search -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
      <div class="flex items-center gap-2">
        <div class="relative w-full sm:w-56">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search countries..."
            class="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#070b16] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <svg class="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>

        <span class="text-xs text-slate-400 font-mono whitespace-nowrap">
          Selected: <strong :class="variant === 'block' ? 'text-rose-400' : 'text-emerald-400'">{{ modelValue.length }}</strong>/{{ ALL_REGIONS.length }}
        </span>
      </div>

      <!-- Quick Select Buttons -->
      <div class="flex items-center gap-1.5 flex-wrap text-xs">
        <button
          type="button"
          @click="selectTier1"
          class="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
        >
          Tier 1 (Top 5)
        </button>
        <button
          type="button"
          @click="selectEurope"
          class="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
        >
          Europe
        </button>
        <button
          type="button"
          @click="selectAll"
          class="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
        >
          Select All
        </button>
        <button
          v-if="modelValue.length > 0"
          type="button"
          @click="clearAll"
          class="px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Regions Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      <button
        v-for="r in filteredRegions"
        :key="r.code"
        type="button"
        @click="toggle(r.code)"
        :class="[
          'px-2.5 py-2 rounded-lg border text-left text-xs transition-all duration-150 flex items-center justify-between group',
          modelValue.includes(r.code)
            ? variant === 'block'
              ? 'bg-rose-950/70 border-rose-500/80 text-rose-100 shadow-sm shadow-rose-900/30'
              : 'bg-emerald-950/70 border-emerald-500/80 text-emerald-100 shadow-sm shadow-emerald-900/30'
            : 'bg-slate-900/60 border-white/5 hover:border-white/20 hover:bg-slate-800/60 text-slate-300'
        ]"
      >
        <div class="flex items-center gap-1.5 truncate mr-1">
          <span class="text-sm shrink-0">{{ r.flag }}</span>
          <span class="font-bold text-[11px] font-mono shrink-0">{{ r.code }}</span>
          <span class="text-[11px] text-slate-400 group-hover:text-slate-200 truncate">
            {{ r.name }}
          </span>
        </div>

        <span
          :class="[
            'text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-opacity',
            modelValue.includes(r.code) ? 'opacity-100 font-bold' : 'opacity-0 group-hover:opacity-40'
          ]"
        >
          ✓
        </span>
      </button>
    </div>

    <div v-if="filteredRegions.length === 0" class="py-4 text-center text-xs text-slate-500">
      No regions matching "{{ searchQuery }}".
    </div>
  </div>
</template>
