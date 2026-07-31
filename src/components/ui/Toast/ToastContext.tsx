'use client';
import { ToastContainer } from "./ToastContainer";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children } : { children:ReactNode }) {
    const [ toasts, setToasts ] = useState<Toast[]>([]);

    const showToast = useCallback((message:string, type: ToastType = 'error') => {
        const id = Date.now();
        setToasts((prev) => [...prev, {id, message, type}]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id:number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return(
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast(){
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error ('useToast debe usarse dentro de ToastProvider');
    return ctx;
}