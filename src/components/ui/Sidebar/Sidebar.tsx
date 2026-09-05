import { BrandLogo } from "../BrandLogo";
import { ThemeToggle } from "../ThemeToggle";
import { SidebarNavItem } from "./SidebarNavItems";
import type { NavItem } from "@/constants/navigations";

interface SidebarProps {
    items: NavItem[];
    mobileOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ items, mobileOpen = false, onClose }: SidebarProps){
    return(
        <>
            {mobileOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.45)',
                        zIndex: 25,
                        display: 'block',
                    }}
                />
            )}

            <aside
                style={{
                    width: 'var(--sidebar-width)',
                    minHeight: '100vh',
                    background: 'var(--surface)',
                    borderRight: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'sticky',
                    top: 0,
                    flexShrink: 0,
                    zIndex: 30,
                    boxShadow: 'var(--shadow)',
                    transition: 'transform 0.25s ease',
                    transform: mobileOpen ? 'translateX(0)' : 'translateX(0)',
                }}
                className="admin-sidebar"
                data-open={mobileOpen}
            >
                <BrandLogo />
                <nav style={{ flex: 1, paddingTop: '0.5rem' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {items.map((item) => (
                            <SidebarNavItem key={item.href} item={item} onNavigate={onClose} />
                        ))}
                    </ul>
                </nav>

                <div style={{ padding: '0.75rem 1rem 1.25rem', borderTop: '1px solid var(--border)' }}>
                    <ThemeToggle />
                </div>
            </aside>
        </>
    );
}