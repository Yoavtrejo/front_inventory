import type { Metadata } from "next";
import { GestionPermisos } from "@/features/permisos";

export const metadata: Metadata = {title: 'Permisos | SIDERED'};

export default function PermisosPage() {
    return <GestionPermisos />;
}