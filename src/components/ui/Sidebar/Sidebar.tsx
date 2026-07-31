import { BrandLogo } from "../BrandLogo";
import { SidebarNavItem } from "./SidebarNavItems";
import type { NavItem } from "@/constants/navigations";

interface SidebarProps{
    items: NavItem[];
}

export function Sidebar({ items }: SidebarProps){
    return(
        <aside style={{ width:'220px', minHeight: '100vh', background:'#ffffff', borderRight:'1px solid #f0f0f0', display: 'flex', flexDirection:'column', position:'sticky', top:0, flexShrink:0, zIndex:20 }}>
            <BrandLogo/>
            <nav style={{ flex:1, paddingTop:'0.5rem' }}>
                <ul style={{ listStyle: 'none', margin:0, padding:0, display:'flex', flexDirection: 'column', gap:'2px' }}>
                    {items.map((item) => (
                        <SidebarNavItem key={item.href} item={item}/>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}