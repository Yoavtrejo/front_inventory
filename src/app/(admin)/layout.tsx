'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { ADMIN_NAV } from "@/constants/navigations";
import { TOKEN_KEYS } from "@/constants";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}){
    const router = useRouter();

    useEffect(()=>{
        const rol = localStorage.getItem(TOKEN_KEYS.role);
        if (rol !== 'Administrador'){
            router.replace('/login');
        }
    }, [router]);

    return(
        <div style={{ display:'flex', minHeight:'100vh', background:'#f8f8f8' }}>
            <Sidebar items={ADMIN_NAV}/>

            <main style={{ flex:1, padding:'2rem', overflow:'auto' }}>
                {children}
            </main>
        </div>
    );
}