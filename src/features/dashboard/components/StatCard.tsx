import { IoCalendarOutline, IoCardOutline, IoGridOutline, IoWarningOutline } from "react-icons/io5";
import type { IconType } from "react-icons";

const ICON_MAP: Record<string, IconType> = {
    calendar: IoCalendarOutline,
    card: IoCardOutline,
    grid: IoGridOutline,
    warning: IoWarningOutline,
};

interface StatCardProps{
    label: string;
    value: number;
    icon: string;
}

export function StatCard({ label, value, icon}: StatCardProps){
    const Icon = ICON_MAP[icon] ?? IoCardOutline;

    return(
        <div style={{ background:'#ffffff', borderRadius: '16px', padding: '1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06', minHeight:'140px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color:'#555', fontWeight:500 }}>
                    {label}
                </span>
                <div style={{ width:28, height:28, borderRadius:'50%', background: 'linear-gradient(135ged, #f97316, #e53e6d)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <Icon size={14} color='#fff'/> 
                </div>
            </div>
            <span style={{fontFamily:'Poppins, sans-serif', fontSize:'2rem', fontWeight:700, color:'#1a1a1a', lineHeight:1 }}>
                {String(value).padStart(2, '0')}
            </span>
        </div>
    )
}