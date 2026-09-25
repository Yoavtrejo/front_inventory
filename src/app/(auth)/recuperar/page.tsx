import { RecuperarForm } from "@/features/login";
import type { Metadata } from "next";

export const metadata: Metadata = { title: 'Recuperar contraseña | SIDERED' };

export default function RecuperarPage() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>
                <RecuperarForm />
            </div>
        </div>
    );
}
