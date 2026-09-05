'use client';

import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { StatCard } from "./StatCard";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";

export function AdminDashboard() {
    const { data, recentActivity, loading, error, userName } = useAdminDashboard();

    if (error) {
        return (
            <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>
                <strong>Error al cargar la página: </strong> {error}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div>
                <h1 style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                    ¡Bienvenido {userName}!
                </h1>
                <p style={{ fontFamily: 'Poppins, sans-serif', color: '#e53e6d', fontWeight: 600, fontSize: '1rem', margin: 0 }}>
                    Mantente al día
                </p>
            </div>

            {/* Grid de KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{ height: '110px', borderRadius: '16px', background: 'var(--border)' }} />
                    ))
                    : data?.stats.map((stat) => (
                        <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
                    ))
                }
            </div>

            {/* Panel Principal */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
                <RecentActivity items={recentActivity} loading={loading} />
                <QuickActions />
            </div>
        </div>
    );
}