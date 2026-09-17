import type { Metadata } from "next";
import { DocenteDashboard } from "@/features/docente/dashboard";

export const metadata : Metadata = { title: 'Dashboard | SIDERED' };

export default function DocenteDashboardPage() {
    return <DocenteDashboard/>;
}