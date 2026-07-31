'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/constants/navigations";

interface SidebarNavItemProps{
    item: NavItem;
}

export function SidebarNavItem({ item }: SidebarNavItemProps){
    const pathname = usePathname();
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    const Icon = item.icon;

    return(
        <li>
            <Link href={item.href}
            style={{
                display: 'flex',
                alignItems:'center',
                gap:'0.75rem',
                padding:'0.65rem 1.25rem',
                borderRadius:'12px',
                margin:'0 0.5rem',
                fontFamily:'Poppins, sans-serif',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.9rem',
                color: isActive ? '#ffffff' : '#1a1a1a',
                background: isActive ? 'linear-gradient(135deg, #f97316, #e53e6d)' : 'transparent',
                textDecoration: 'none',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
            }}>
                    <Icon size={20}/>
                    <span>{item.label}</span>
                </Link>
        </li>
    )
}