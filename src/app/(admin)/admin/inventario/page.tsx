import type { Metadata } from "next";
import { Inventario } from "@/features/inventario";

export const metadata: Metadata = { title: 'Inventario | SIDERED' };

export default function InventarioPage(){
    return <Inventario/>;
}