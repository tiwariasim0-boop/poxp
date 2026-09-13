<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "../composables/useToast";

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
    label?: string;
    showLineNumbers?: boolean;
  }>(),
  {
    language: "php",
    label: undefined,
    showLineNumbers: false,
  }
);

const copied = ref(false);
const { success } = useToast();

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    success("Copied code snippet to clipboard");
    setTimeout(() => (copied.value = false), 2200);
  } catch {
    // fallback
    const el = document.getElementById("code-fallback");
    if (el) {
      const range = document.createRange();
      range.selectNodeContents(el);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
    copied.value = true;
    setTimeout(() => (copied.value = false), 2200);
  }
}
</script>

<template>
  <div class="rounded-xl overflow-hidden border border-white/10 bg-[#070b16] shadow-xl group transition-all duration-200 hover:border-indigo-500/30">
    <!-- Terminal Header Bar -->
    <div class="px-4 py-2.5 bg-[#0e1526]/90 border-b border-white/5 flex items-center justify-between select-none">
      <div class="flex items-center gap-2">
        <!-- macOS Traffic Lights -->
        <div class="flex items-center gap-1.5 mr-2">
          <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block border border-rose-600/40"></span>
          <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block border border-amber-600/40"></span>
          <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block border border-emerald-600/40"></span>
        </div>
        <span v-if="label" class="text-xs font-semibold text-slate-300 tracking-wide">
          {{ label }}
        </span>
        <span v-else class="text-xs font-mono uppercase text-slate-400">
          {{ language }}
        </span>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-[11px] font-mono text-slate-400 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5">
          {{ language }}
        </span>

        <button
          type="button"
          @click="copy"
          class="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-600/30 hover:text-indigo-200 text-slate-300 border border-white/10 transition-all duration-200 active:scale-95"
          :title="'Copy to clipboard'"
        >
          <svg v-if="!copied" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <svg v-else class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span :class="copied ? 'text-emerald-400 font-semibold' : ''">
            {{ copied ? "Copied!" : "Copy" }}
          </span>
        </button>
      </div>
    </div>

    <!-- Code Block Content -->
    <div class="relative">
      <pre
        id="code-fallback"
        class="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-200 selection:bg-indigo-500/40"
      ><code>{{ code }}</code></pre>
    </div>
  </div>
</template>
