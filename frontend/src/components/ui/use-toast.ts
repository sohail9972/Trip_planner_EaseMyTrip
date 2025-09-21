export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  type ToastProps,
  type ToastActionElement,
} from "./toast"

import { toast as sonnerToast } from "sonner"

type ToastVariant = "default" | "destructive"

type UseToastOptions = {
  title?: string
  description?: string
  variant?: ToastVariant
}

export function useToast() {
  function toast({ title, description, variant = "default" }: UseToastOptions) {
    const msg = title ?? description ?? ""
    if (variant === "destructive") {
      sonnerToast.error(msg, description ? { description } : undefined)
    } else {
      sonnerToast(msg, description ? { description } : undefined)
    }
  }

  return { toast }
}
