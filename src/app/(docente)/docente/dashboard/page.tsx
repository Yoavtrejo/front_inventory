import type { Metadata } from "next";
import { DocenteDashboard } from "@/features/docente";

export const metadata: Metadata = { title: 'Inicio | SIDERED' };

export default function DocenteDashboardPage() {
    return <DocenteDashboard />;
}
