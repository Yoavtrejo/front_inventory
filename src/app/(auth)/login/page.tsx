import { FormLogin } from "@/features/login";
import type { Metadata } from "next";

export const metadata: Metadata ={
    title: 'Iniciar sesión | SIDERED',
    description: 'Pantalla de inicio de sesión del Sistema de Inventario.',
};

export default function LoginPage(){
    return(
        <div style={{display: 'flex', alignItems:'center', justifyContent: 'center', minHeight: '100vh', padding:'1rem'}}>
            <div style={{width:'100%', maxWidth:'440px'}}>
                <FormLogin/>
            </div>
        </div>
    );
}