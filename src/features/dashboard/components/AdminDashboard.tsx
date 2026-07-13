'use client';

import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { StatCard } from "./StatCard";
import { RecentActivity } from "./RecentActivity";

export function AdminDashboard(){
    const { data, loading, error, userName } = useAdminDashboard();

    if (error){
        return(
            <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>
                <strong>Error al cargar la página: </strong> {error}
            </div>
        );
    }

    return(
        <div>
            <h1 style={{ fontWeight: 700, fontSize: '2rem', color:'#1a1a1a', marginBottom:'0.25rem' }}>
                ¡Bienvenido {userName}!
            </h1>
            <p style={{ fontFamily:'var(--font-poppins), sans-serif', color:'#e53e6d', fontWeight: 600, fontSize:'1rem', marginBottom:'1.75rem' }}>
                Mantente al día
            </p>

            <div style={{ display: 'flex', gap:'1rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection:'column', gap:'1rem', minHeight:'200px' }}>
                    {loading ? Array.from({ length: 4 }).map((_,i) => (
                        <div key={i} style={{ height:'90px', borderRadius:'16px', background: '#e8e8e8'}}/>
                    )): data?.stats.map((stat) => (
                        <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon}/>
                    ))
                    }
                </div>

                <RecentActivity />

            </div>
        </div>
    )
}