"use client";

import { IoEye, IoEyeOff, IoMailOutline, IoLockClosedOutline } from 'react-icons/io5';
import { useLogin } from '@/features/login';
import { usePasswordVisibility } from '@/features/login';
import Link from 'next/link';

export function FormLogin() {
    const {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        error,
        handleLogin,
    } = useLogin();

    const {
        showPassword,
        togglePasswordVisibility,
    } = usePasswordVisibility();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div style={{background: '#ffffff',borderRadius: '16px',boxShadow: '0 8px 40px rgba(0, 0, 0, 0.13)',padding: '2.5rem 2.25rem 2rem',}}>
            
            {/* Encabezado */}
            <h1 className="title is-4 has-text-centered" style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: '0.4rem', color: '#1a1a1a'}}>
                Inicio de sesión
            </h1>
            <p className="has-text-centered" style={{fontFamily: 'Poppins',fontWeight: 300,fontSize: '0.875rem',color: '#888',marginBottom: '2rem',lineHeight: '1.5',}}>
                Ingresa tu correo electrónico y contraseña para acceder.
            </p>

            <form onSubmit={handleSubmit}>
                {/* Campo correo */}
                <div className="field">
                    <label 
                        className="label" 
                        htmlFor="email" 
                        style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '0.875rem', color: '#555' }}
                        >
                        <span className="icon is-small" style={{ marginRight: '4px' }}>
                            <IoMailOutline color="#f59e0b" size={16} />
                        </span>
                        Correo electrónico
                    </label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="correo@ejemplo.com"
                            id="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' }}
                        />
                    </div>
                </div>

                {/* Campo contraseña */}
                <div className="field">
                    <label
                        className="label"
                        htmlFor="password"
                        style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '0.875rem', color: '#555' }}
                    >
                        <span className="icon is-small" style={{ marginRight: '4px' }}>
                            <IoLockClosedOutline color="#f59e0b" size={16} />
                        </span>
                        Contraseña
                    </label>
                    <div className="control has-icons-right">
                        <input
                            className="input"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' }}
                        />
                        <span
                            className="icon is-small is-right"
                            onClick={togglePasswordVisibility}
                            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                        >
                            {showPassword
                                ? <IoEyeOff size={18} color="#aaa" />
                                : <IoEye size={18} color="#aaa" />
                            }
                        </span>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="help is-danger" style={{ fontFamily: 'Poppins', marginBottom: '0.75rem' }}>
                        {error}
                    </p>
                )}

                {/* Botón */}
                <div className="field" style={{ marginTop: '1.25rem' }}>
                    <button
                        className="button is-fullwidth"
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: '#d81e5b',
                            color: '#ffffff',
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            borderRadius: '20px',
                            border: 'none',
                            height: '44px',
                            letterSpacing: '0.01em',
                            transition: 'opacity 0.2s',
                            opacity: loading ? 0.75 : 1,
                        }}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </div>

                {/* Link registro */}
                <p className="has-text-centered" style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '0.85rem', color: '#888', marginTop: '1.25rem' }}>
                    ¿No tienes una cuenta?{' '}
                    <Link href="/registro" style={{ color: '#d81e5b', fontWeight: 500 }}>
                        Regístrate
                    </Link>
                </p>
            </form>
        </div>
    );
}