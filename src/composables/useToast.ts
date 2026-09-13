import { ref } from "vue";

export interface Toast {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

const toasts = ref<Toast[]>([]);
let nextId = 1;

export function useToast() {
  function show(message: string, type: "success" | "error" | "info" = "success", duration = 3000) {
    const id = nextId++;
    toasts.value.push({ id, message, type, duration });
    setTimeout(() => {
      remove(id);
    }, duration);
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return {
    toasts,
    show,
    remove,
    success: (msg: string) => show(msg, "success"),
    error: (msg: string) => show(msg, "error", 4000),
    info: (msg: string) => show(msg, "info"),
  };
}
