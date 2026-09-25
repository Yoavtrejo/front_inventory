import type { Metadata } from "next";
import { Reportes } from "@/features/reportes";

export const metadata: Metadata = { title: 'Reportes | SIDERED '};

export default function ReportesPage() {
    return <Reportes/>;
}