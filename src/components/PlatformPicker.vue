<script setup lang="ts">
interface PlatformDef {
  id: string;
  name: string;
  category: "desktop" | "mobile";
  hint: string;
}

const PLATFORMS: PlatformDef[] = [
  { id: "mac", name: "macOS", category: "desktop", hint: "Safari, Chrome on Mac" },
  { id: "windows", name: "Windows", category: "desktop", hint: "Chrome, Edge on PC" },
  { id: "ios", name: "iOS", category: "mobile", hint: "Safari & WebKit on iPhone" },
  { id: "android", name: "Android", category: "mobile", hint: "Chrome on Android" },
];

const props = defineProps<{
  modelValue: string[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

function toggle(value: string) {
  const next = props.modelValue.includes(value)
    ? props.modelValue.filter((v) => v !== value)
    : [...props.modelValue, value];
  emit("update:modelValue", next);
}

function selectAll() {
  emit("update:modelValue", PLATFORMS.map((p) => p.id));
}

function selectCategory(cat: "desktop" | "mobile") {
  const filtered = PLATFORMS.filter((p) => p.category === cat).map((p) => p.id);
  const currentOther = props.modelValue.filter((v) => {
    const found = PLATFORMS.find((p) => p.id === v);
    return found && found.category !== cat;
  });
  emit("update:modelValue", Array.from(new Set([...currentOther, ...filtered])));
}

function clearAll() {
  emit("update:modelValue", []);
}
</script>

<template>
  <div class="space-y-2.5">
    <!-- Preset quick toggles -->
    <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
      <span class="text-zinc-400 text-[11px]">Operating Systems</span>
      <div class="flex items-center gap-1.5 text-[11px]">
        <button
          type="button"
          @click="selectAll"
          class="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
        >
          All
        </button>
        <button
          type="button"
          @click="selectCategory('desktop')"
          class="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
        >
          Desktop
        </button>
        <button
          type="button"
          @click="selectCategory('mobile')"
          class="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
        >
          Mobile
        </button>
        <button
          v-if="modelValue.length > 0"
          type="button"
          @click="clearAll"
          class="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Platform Cards Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      <button
        v-for="p in PLATFORMS"
        :key="p.id"
        type="button"
        @click="toggle(p.id)"
        :class="[
          'text-left p-3 rounded-lg border transition-all duration-150 flex flex-col justify-between',
          modelValue.includes(p.id)
            ? 'bg-zinc-900 border-zinc-300 text-white'
            : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
        ]"
      >
        <div class="flex items-center justify-between w-full mb-2">
          <span class="font-medium text-xs text-white">
            {{ p.name }}
          </span>

          <span
            :class="[
              'w-4 h-4 rounded-full flex items-center justify-center text-[9px]',
              modelValue.includes(p.id)
                ? 'bg-white text-black font-bold'
                : 'border border-zinc-700 text-transparent'
            ]"
          >
            ✓
          </span>
        </div>

        <span class="text-[11px] text-zinc-500">
          {{ p.hint }}
        </span>
      </button>
    </div>
  </div>
</template>
