'use client';

import { IoPersonOutline } from 'react-icons/io5';
import { useRecuperarPassword } from '../hooks/useRecuperarPassword';
import { AuthCard, AuthNotice, AUTH_INPUT_STYLE, AUTH_LABEL_STYLE, authButtonStyle } from './AuthCard';

export function RecuperarForm() {
    const { identificador, setIdentificador, loading, error, successMessage, handleSubmit } = useRecuperarPassword();

    return (
        <AuthCard title="Recuperar contraseña" subtitle="Escribe tu matrícula y te enviaremos un enlace a tu correo para crear una contraseña nueva.">
            {successMessage ? (
                <AuthNotice message={successMessage} />
            ) : (
                <form onSubmit={(event) => { event.preventDefault(); handleSubmit(); }}>
                    <div className="field">
                        <label className="label" htmlFor="identificador" style={AUTH_LABEL_STYLE}>
                            <span className="icon is-small" style={{ marginRight: '4px' }}>
                                <IoPersonOutline color="#f59e0b" size={16} />
                            </span>
                            Matrícula
                        </label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                id="identificador"
                                autoComplete="username"
                                placeholder="e.g. 2231029"
                                value={identificador}
                                onChange={(event) => setIdentificador(event.target.value)}
                                required
                                style={AUTH_INPUT_STYLE}
                            />
                        </div>
                    </div>

                    {error && <p className="help is-danger" style={{ fontFamily: 'Poppins', marginBottom: '0.75rem' }}>{error}</p>}

                    <div className="field" style={{ marginTop: '1.25rem' }}>
                        <button className="button is-fullwidth" type="submit" disabled={loading} style={authButtonStyle(loading)}>
                            {loading ? 'Enviando...' : 'Enviar enlace'}
                        </button>
                    </div>
                </form>
            )}
        </AuthCard>
    );
}
