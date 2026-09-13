<script setup lang="ts">
import { ref, computed } from "vue";

interface RegionInfo {
  code: string;
  name: string;
  tier: 1 | 2;
  region: "NA" | "EU" | "APAC" | "LATAM" | "ME";
}

const ALL_REGIONS: RegionInfo[] = [
  { code: "US", name: "United States", tier: 1, region: "NA" },
  { code: "GB", name: "United Kingdom", tier: 1, region: "EU" },
  { code: "CA", name: "Canada", tier: 1, region: "NA" },
  { code: "AU", name: "Australia", tier: 1, region: "APAC" },
  { code: "DE", name: "Germany", tier: 1, region: "EU" },
  { code: "FR", name: "France", tier: 2, region: "EU" },
  { code: "IT", name: "Italy", tier: 2, region: "EU" },
  { code: "ES", name: "Spain", tier: 2, region: "EU" },
  { code: "NL", name: "Netherlands", tier: 2, region: "EU" },
  { code: "JP", name: "Japan", tier: 2, region: "APAC" },
  { code: "KR", name: "South Korea", tier: 2, region: "APAC" },
  { code: "SG", name: "Singapore", tier: 2, region: "APAC" },
  { code: "IN", name: "India", tier: 2, region: "APAC" },
  { code: "BR", name: "Brazil", tier: 2, region: "LATAM" },
  { code: "MX", name: "Mexico", tier: 2, region: "LATAM" },
  { code: "AE", name: "United Arab Emirates", tier: 2, region: "ME" },
  { code: "SA", name: "Saudi Arabia", tier: 2, region: "ME" },
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
  <div class="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3.5">
    <!-- Header with Quick Filter Presets and Search -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-zinc-800/80">
      <div class="flex items-center gap-2">
        <div class="relative w-full sm:w-48">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search regions..."
            class="w-full px-2.5 py-1 rounded bg-black border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <span class="text-[11px] text-zinc-500 font-mono">
          Selected: <strong class="text-white">{{ modelValue.length }}</strong>/{{ ALL_REGIONS.length }}
        </span>
      </div>

      <!-- Quick Select Buttons -->
      <div class="flex items-center gap-1.5 text-[11px]">
        <button
          type="button"
          @click="selectTier1"
          class="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
        >
          Tier 1
        </button>
        <button
          type="button"
          @click="selectEurope"
          class="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
        >
          Europe
        </button>
        <button
          type="button"
          @click="selectAll"
          class="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
        >
          All
        </button>
        <button
          v-if="modelValue.length > 0"
          type="button"
          @click="clearAll"
          class="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Regions Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
      <button
        v-for="r in filteredRegions"
        :key="r.code"
        type="button"
        @click="toggle(r.code)"
        :class="[
          'px-2.5 py-1.5 rounded border text-left text-xs transition-colors flex items-center justify-between',
          modelValue.includes(r.code)
            ? 'bg-zinc-800 border-zinc-300 text-white font-medium'
            : 'bg-black border-zinc-800/80 hover:border-zinc-700 text-zinc-400'
        ]"
      >
        <span class="font-mono text-xs">{{ r.code }}</span>
        <span class="text-[10px] text-zinc-500 truncate ml-1">{{ r.name }}</span>
      </button>
    </div>
  </div>
</template>
