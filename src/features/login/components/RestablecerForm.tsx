'use client';

import Link from 'next/link';
import { IoEye, IoEyeOff, IoLockClosedOutline } from 'react-icons/io5';
import { useRestablecerPassword } from '../hooks/useRestablecerPassword';
import { usePasswordVisibility } from '../hooks/usePasswordVisibility';
import { AuthCard, AuthNotice, AUTH_INPUT_STYLE, AUTH_LABEL_STYLE, authButtonStyle } from './AuthCard';

export function RestablecerForm() {
    const {
        password, setPassword, passwordConfirm, setPasswordConfirm,
        loading, error, successMessage, isLinkComplete, handleSubmit,
    } = useRestablecerPassword();
    const { showPassword, togglePasswordVisibility } = usePasswordVisibility();

    if (!isLinkComplete) {
        return (
            <AuthCard title="Enlace incompleto" subtitle="Abre el enlace completo que llegó a tu correo o solicita uno nuevo.">
                <Link href="/recuperar" className="button is-fullwidth" style={{ ...authButtonStyle(false), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Solicitar un enlace nuevo
                </Link>
            </AuthCard>
        );
    }

    return (
        <AuthCard title="Nueva contraseña" subtitle="Crea una contraseña nueva para tu cuenta.">
            {successMessage ? (
                <>
                    <AuthNotice message={successMessage} />
                    <Link href="/login" className="button is-fullwidth" style={{ ...authButtonStyle(false), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Iniciar sesión
                    </Link>
                </>
            ) : (
                <form onSubmit={(event) => { event.preventDefault(); handleSubmit(); }}>
                    <div className="field">
                        <label className="label" htmlFor="password" style={AUTH_LABEL_STYLE}>
                            <span className="icon is-small" style={{ marginRight: '4px' }}>
                                <IoLockClosedOutline color="#f59e0b" size={16} />
                            </span>
                            Nueva contraseña
                        </label>
                        <div className="control has-icons-right">
                            <input
                                className="input"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                style={AUTH_INPUT_STYLE}
                            />
                            <span className="icon is-small is-right" onClick={togglePasswordVisibility} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
                                {showPassword ? <IoEyeOff size={18} color="#aaa" /> : <IoEye size={18} color="#aaa" />}
                            </span>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="passwordConfirm" style={AUTH_LABEL_STYLE}>
                            <span className="icon is-small" style={{ marginRight: '4px' }}>
                                <IoLockClosedOutline color="#f59e0b" size={16} />
                            </span>
                            Confirmar contraseña
                        </label>
                        <div className="control">
                            <input
                                className={`input ${passwordConfirm && passwordConfirm !== password ? 'is-danger' : ''}`}
                                type={showPassword ? 'text' : 'password'}
                                id="passwordConfirm"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                value={passwordConfirm}
                                onChange={(event) => setPasswordConfirm(event.target.value)}
                                required
                                style={AUTH_INPUT_STYLE}
                            />
                        </div>
                        {passwordConfirm && passwordConfirm !== password && (
                            <p className="help is-danger" style={{ fontFamily: 'Poppins' }}>Las contraseñas no coinciden.</p>
                        )}
                    </div>

                    {error && (
                        <p className="help is-danger" style={{ fontFamily: 'Poppins', marginBottom: '0.75rem' }}>
                            {error}{' '}
                            {error.includes('venció') && <Link href="/recuperar" style={{ color: '#d81e5b', fontWeight: 500 }}>Solicitar uno nuevo</Link>}
                        </p>
                    )}

                    <div className="field" style={{ marginTop: '1.25rem' }}>
                        <button className="button is-fullwidth" type="submit" disabled={loading} style={authButtonStyle(loading)}>
                            {loading ? 'Guardando...' : 'Guardar contraseña'}
                        </button>
                    </div>
                </form>
            )}
        </AuthCard>
    );
}
