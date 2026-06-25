import { Toaster, toast } from "react-hot-toast";

/**
 * Render this once near the root of the app (see App.jsx). Styling
 * matches the app's calm palette rather than react-hot-toast's defaults.
 */
export const ToastProvider = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      duration: 4000,
      style: {
        background: "#1e293b",
        color: "#f8fafc",
        borderRadius: "0.75rem",
        padding: "0.75rem 1rem",
        fontSize: "0.9rem",
      },
      success: {
        iconTheme: { primary: "#16a34a", secondary: "#f8fafc" },
      },
      error: {
        iconTheme: { primary: "#dc2626", secondary: "#f8fafc" },
      },
    }}
  />
);

// Thin helper exports so call sites do `notify.success(...)` instead of
// importing react-hot-toast directly — keeps the library swappable.
export const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast(message),
};
