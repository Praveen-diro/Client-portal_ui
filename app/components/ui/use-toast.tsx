// Inspired by react-hot-toast library
import { useState, useEffect, useCallback, createContext, useContext } from "react";

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
};

export type ToastActionElement = React.ReactElement<{
  altText: string;
  onClick: () => void;
}>;

type ToastContextValue = {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, "id">) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<ToastProps>) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    ...context,
    toast: (props: Omit<ToastProps, "id">) => {
      context.addToast(props);
    },
  };
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);

    setToasts((prevToasts) => [...prevToasts, { id, ...toast }]);

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = useCallback((id: string, toast: Partial<ToastProps>) => {
    setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, ...toast } : t)));
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    updateToast,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
