'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar/Sidebar";
import { DOCENTE_NAV } from "@/constants/navigations";
import { TOKEN_KEYS } from "@/constants";
import { ToastProvider } from "@/components/ui/Toast/ToastContext";

export default function DocenteLayout({ children } : { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const rol = localStorage.getItem(TOKEN_KEYS.role);
        if  (rol !== 'Docente') router.replace('/login');
    }, []);

    return (
        <ToastProvider>
            <div style={{ display:'flex', minHeight:'100vh', background:'#F8F8F8' }}>
                <Sidebar items={DOCENTE_NAV} />
                <main style={{ flex:1, padding:'2rem', overflow:'auto'}}>
                    {children}
                </main>
            </div>
        </ToastProvider>
    );
}