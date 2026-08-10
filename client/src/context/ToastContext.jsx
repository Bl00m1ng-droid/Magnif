import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

const STYLES = {
  success: { bg: "#4E9B02", icon: "✓" },
  error: { bg: "#C23B22", icon: "✕" },
  info: { bg: "#0B1B42", icon: "ℹ" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  function dismiss(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
        {toasts.map((toast) => {
          const style = STYLES[toast.type] || STYLES.info;
          return (
            <div
              key={toast.id}
              onClick={() => dismiss(toast.id)}
              className="flex items-start gap-3 text-white rounded-lg shadow-lg px-4 py-3 cursor-pointer animate-[slideIn_0.25s_ease-out]"
              style={{ backgroundColor: style.bg }}
            >
              <span className="font-bold mt-0.5">{style.icon}</span>
              <p className="text-sm leading-snug">{toast.message}</p>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}