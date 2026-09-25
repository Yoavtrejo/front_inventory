import { FormRegistro, WaveDecoration } from "@/features/login";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Registro | SIDERED',
    description: 'Pantalla de registro del sistema de inventario',
};

export default function RegisterPage(){
    return(
        <div style={{display: 'flex', minHeight:'100vh'}}>
            <div style={{flex: 1, display: 'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                <WaveDecoration/>
            </div>

            <div style={{flex:1, background:'#ffffff', display:'flex', alignItems:'center', justifyContent:'center', padding:'3 rem 3.5rem'}}>
                <div style={{ width:'100%', maxWidth:'420px'}}>
                    <FormRegistro/>
                </div>
            </div>
        </div>
    );
}