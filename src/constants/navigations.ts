import {
    IoHomeOutline,
    IoCardOutline,
    IoCubeOutline,
    IoGridOutline,
    IoLockClosedOutline,
    IoPersonOutline,
    IoInformationCircleOutline,
    IoBarChartOutline,
} from 'react-icons/io5';

import type { IconType } from 'react-icons';

export interface NavItem{
    label: string;
    href: string;
    icon: IconType;
}

export const ADMIN_NAV: NavItem[] = [
    { label: 'Inicio', href: '/admin/dashboard', icon: IoHomeOutline },
    { label: 'Préstamos', href:'/admin/prestamos', icon:IoCardOutline },
    { label: 'Inventario', href:'/admin/inventario', icon: IoCubeOutline },
    { label: 'Islas', href:'/admin/islas', icon: IoGridOutline },
    { label: 'Permisos', href:'/admin/permisos', icon: IoLockClosedOutline },
    { label: 'Reportes', href:'/admin/reportes', icon: IoBarChartOutline},
    { label: 'Perfil', href:'/admin/perfil', icon: IoPersonOutline },
    { label: 'Acerca de', href:'/admin/acerca', icon: IoInformationCircleOutline},
];