import type { Metadata } from "next";
import { CrearPrestamo } from "@/features/prestamos";

export const metadata: Metadata = { title: 'Crear Préstamo | SIDERED' };

export default function CrearPrestamoPage(){
    return <CrearPrestamo/>
}