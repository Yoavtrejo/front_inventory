
import type {Metadata} from 'next';
import { FormRegistro } from '@/features/login';
import { WaveDecoration } from '@/features/login';

export const metadata: Metadata = {
    title: 'Registro',
    description: 'Pantalla de registro del sistema de inventario',
}

export default function RegisterPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row',  }}>

            <div style={{flex: 1,background: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 15%, #fbcfe8 45%, #ddd6fe 70%, #bfdbfe 100%)', zIndex: 0,display: 'flex',alignItems: 'center',justifyContent: 'center',overflow: 'hidden',}}>
                <WaveDecoration />
            </div>

            <div style={{flex: 1,background: '#ffffff',display: 'flex',alignItems: 'center',justifyContent: 'center',padding: '3rem 3.5rem',}}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    <FormRegistro />
                </div>
            </div>
            
        </div>
    );
}