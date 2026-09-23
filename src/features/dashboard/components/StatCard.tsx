import { IoCalendarOutline, IoCardOutline, IoGridOutline, IoWarningOutline, IoPeopleOutline, IoClipboardOutline, IoCheckmarkDoneOutline, IoTimeOutline } from "react-icons/io5";
import type { IconType } from "react-icons";

const ICON_MAP: Record<string, IconType> = {
    calendar: IoCalendarOutline,
    card: IoCardOutline,
    grid: IoGridOutline,
    warning: IoWarningOutline,
    people: IoPeopleOutline,
    clipboard: IoClipboardOutline,
    done: IoCheckmarkDoneOutline,
    pending: IoTimeOutline,
};

interface StatCardProps{
    label: string;
    value: number;
    icon: string;
}

export function StatCard({ label, value, icon }: StatCardProps) {
    const Icon = ICON_MAP[icon] ?? IoCardOutline;

    return (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: 500 }}>
                    {label}
                </span>
                {/* Corrección del typo '135ged' a '135deg' */}
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #e53e6d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color='#fff' /> 
                </div>
            </div>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
                {String(value).padStart(2, '0')}
            </span>
        </div>
    );
}