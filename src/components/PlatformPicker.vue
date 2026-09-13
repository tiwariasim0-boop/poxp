<script setup lang="ts">
interface PlatformDef {
  id: string;
  name: string;
  category: "desktop" | "mobile";
  hint: string;
}

const PLATFORMS: PlatformDef[] = [
  { id: "mac", name: "macOS", category: "desktop", hint: "Safari, Chrome, Arc on macOS" },
  { id: "windows", name: "Windows", category: "desktop", hint: "Edge, Chrome, Firefox on PC" },
  { id: "ios", name: "iOS", category: "mobile", hint: "Mobile Safari & Webkit on iPhone/iPad" },
  { id: "android", name: "Android", category: "mobile", hint: "Chrome & WebView on Android" },
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
  <div class="space-y-3">
    <!-- Preset quick toggles -->
    <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
      <span class="text-slate-400">Target Operating Systems:</span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="selectAll"
          class="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
        >
          All
        </button>
        <button
          type="button"
          @click="selectCategory('desktop')"
          class="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
        >
          Desktop Only
        </button>
        <button
          type="button"
          @click="selectCategory('mobile')"
          class="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
        >
          Mobile Only
        </button>
        <button
          v-if="modelValue.length > 0"
          type="button"
          @click="clearAll"
          class="px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Platform Cards Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <button
        v-for="p in PLATFORMS"
        :key="p.id"
        type="button"
        @click="toggle(p.id)"
        :class="[
          'relative text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between group',
          modelValue.includes(p.id)
            ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900/90 border-indigo-500 shadow-glow'
            : 'bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-900/80 text-slate-400'
        ]"
      >
        <div class="flex items-center justify-between w-full mb-2">
          <!-- Icon -->
          <div
            :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
              modelValue.includes(p.id)
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white/5 text-slate-400 group-hover:text-slate-200'
            ]"
          >
            <!-- Mac Icon -->
            <svg v-if="p.id === 'mac'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.15c.61-.75 1.04-1.8 1.01-2.85-.92.04-2.02.62-2.66 1.37-.58.67-1.09 1.74-1.04 2.79 1.02.08 2.08-.56 2.69-1.31z"/>
            </svg>
            <!-- Windows Icon -->
            <svg v-else-if="p.id === 'windows'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
            </svg>
            <!-- iOS Icon -->
            <svg v-else-if="p.id === 'ios'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
            <!-- Android Icon -->
            <svg v-else-if="p.id === 'android'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0003s.4482-1.0003.9993-1.0003c.5516 0 .9997.4486.9997 1.0003s-.4481 1.0003-.9997 1.0003m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0003s.4482-1.0003.9993-1.0003c.5516 0 .9997.4486.9997 1.0003s-.4481 1.0003-.9997 1.0003m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4128 13.8533 8.0805 12 8.0805c-1.8533 0-3.5902.3323-5.1368.8692L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/>
            </svg>
          </div>

          <!-- Selection Check Indicator -->
          <span
            :class="[
              'w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all',
              modelValue.includes(p.id)
                ? 'bg-indigo-500 text-white'
                : 'border border-white/10 group-hover:border-white/30 text-transparent'
            ]"
          >
            ✓
          </span>
        </div>

        <div>
          <div class="font-semibold text-sm" :class="modelValue.includes(p.id) ? 'text-white' : 'text-slate-300'">
            {{ p.name }}
          </div>
          <div class="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
            {{ p.hint }}
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
