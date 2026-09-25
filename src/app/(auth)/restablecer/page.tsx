import { Suspense } from "react";
import { RestablecerForm } from "@/features/login";
import type { Metadata } from "next";

export const metadata: Metadata = { title: 'Nueva contraseña | SIDERED' };

export default function RestablecerPage() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>
                <Suspense fallback={null}>
                    <RestablecerForm />
                </Suspense>
            </div>
        </div>
    );
}
