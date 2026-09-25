import {
    IoHomeOutline,
    IoCardOutline,
    IoCubeOutline,
    IoGridOutline,
    IoLockClosedOutline,
    IoPersonOutline,
    IoInformationCircleOutline,
    IoBarChartOutline,
    IoDocumentTextOutline,
    IoPeopleOutline,
    IoClipboardOutline,
    IoCalendarOutline
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
    { label: 'Calendario', href:'/admin/calendario', icon: IoCalendarOutline },
    { label: 'Permisos', href:'/admin/permisos', icon: IoLockClosedOutline },
    { label: 'Reportes', href:'/admin/reportes', icon: IoBarChartOutline},
    { label: 'Perfil', href:'/admin/perfil', icon: IoPersonOutline },
    { label: 'Acerca de', href:'/admin/acerca', icon: IoInformationCircleOutline},
];

export const DOCENTE_NAV: NavItem[] = [
    { label: 'Inicio', href: '/docente/dashboard', icon: IoHomeOutline },
  { label: 'Préstamos', href: '/docente/prestamos', icon: IoCardOutline },
  { label: 'Recursos', href: '/docente/recursos', icon: IoDocumentTextOutline },
  { label: 'Islas', href: '/docente/islas', icon: IoGridOutline },
  { label: 'Actividades', href: '/docente/actividades',  icon: IoClipboardOutline },
  { label: 'Grupos', href: '/docente/grupos', icon: IoPeopleOutline },
  { label: 'Calendario', href: '/docente/calendario', icon: IoCalendarOutline },
  { label: 'Perfil', href: '/docente/perfil', icon: IoPersonOutline },
  { label: 'Acerca de', href: '/docente/acerca', icon: IoInformationCircleOutline }, 
];

export const ALUMNO_NAV: NavItem[] = [
  { label: 'Inicio', href: '/alumno/dashboard', icon: IoHomeOutline },
  { label: 'Préstamos', href: '/alumno/prestamos', icon: IoCardOutline },
  { label: 'Recursos', href: '/alumno/recursos', icon: IoDocumentTextOutline },
  { label: 'Islas', href: '/alumno/islas', icon: IoGridOutline },
  { label: 'Actividades', href: '/alumno/actividades', icon: IoClipboardOutline },
  { label: 'Calendario', href: '/alumno/calendario', icon: IoCalendarOutline },
  { label: 'Perfil', href: '/alumno/perfil', icon: IoPersonOutline },
  { label: 'Acerca de', href: '/alumno/acerca', icon: IoInformationCircleOutline },
];
