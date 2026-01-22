import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

const toastStyles: Record<ToastType, string> = {
  success:
    "bg-emerald-50 border border-emerald-200 text-emerald-900",
  error:
    "bg-red-50 border border-red-200 text-red-900",
  info:
    "bg-blue-50 border border-blue-200 text-blue-900",
  warning:
    "bg-yellow-50 border border-yellow-200 text-yellow-900",
};

export const showToast = ({
  title,
  description = "",
  type = "info",
  duration = 3000,
}: ToastOptions) => {
  toast[type](title, {
    description,
    duration,
    className: `
      rounded-xl shadow-xl
      ${toastStyles[type]}
    `,
  });
};
