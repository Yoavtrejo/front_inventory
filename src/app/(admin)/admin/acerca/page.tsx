import type { Metadata } from "next";
import { AcercaDe } from "@/features/acerca";

export const metadata: Metadata = { title: 'Acerca de | SIDERED' };

export default function AcercaDePage() {
    return <AcercaDe />;
}