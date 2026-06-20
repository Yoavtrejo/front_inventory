'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";

export interface MenuItem{
    label: string;
    icon: IconType;
    href: string;
}

interface SidebarProps{
    items: MenuItem[];
}

export function Sidebar({ items }:SidebarProps){
    const pathname = usePathname();

    return(
        <div style={{width: '150px', minHeight:'100vh', background: '#ffffff', borderRadius: '0 16px 0 16px', boxShadow:'2px 0 16px rgba(0, 0, 0, 0.08', display:'flex', padding:'1.25rem 0.75rem', flexDirection:'column', gap:'0.25rem', flexShrink: 0}}>
            
            {/*Decoración*/}
            <div style={{ display:'flex', gap:'6px', marginBottom: '1.25rem', paddingLeft:'0.25rem'}}>
                <span style={{ width:14, height: 14, borderRadius:'50%', background:'#ef4444', display:'inline-block'}}/>
                <span style={{ width:14, height: 14, borderRadius:'50%', background:'#f97316', display:'inline-block'}}/>
                <span style={{ width:14, height: 14, borderRadius:'50%', background:'#eab308', display:'inline-block'}}/>
            </div>

            {items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return(
                    <Link 
                        key={item.href}
                        href={item.href}
                        style={{display:'flex', alignItems:'center', gap:'8px', padding:'0.6rem 0.75rem', borderRadius:'10px', textDecoration:'none', fontFamily:'Poppins', fontSize:'0.85rem', fontWeight: isActive ? 500 : 400, color: isActive ? '#ffffff' : '#555555', background: isActive ? 'linear-gradient(135deg, #f43f5e, #f97316)' : 'transparent', transition:'all 0.2s'}}
                    >
                        <Icon size={17} color={isActive ? '#ffffff' : '#888888'}/>
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );
}