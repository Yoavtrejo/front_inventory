'use client';

import { useRegister } from '@/features/login';
import { usePasswordVisibility } from '@/features/login';
import { IoMailOpenOutline, IoPersonOutline, IoLockClosedOutline, IoEyeOff, IoEye } from 'react-icons/io5';
import Link from 'next/link';

export function FormRegistro() {
    const {
        username,
        setUsername,
        email,
        setEmail,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        password,
        setPassword,
        loading,
        error,
        handleRegister
    }= useRegister();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleRegister();
    };

    const { 
        showPassword, 
        togglePasswordVisibility
    } = usePasswordVisibility();

    const inputStyle = {fontFamily: 'Poppins',fontSize: '0.875rem',borderRadius: '8px',};

    const labelStyle = {fontFamily: 'Poppins',fontWeight: 400,fontSize: '0.875rem',color: '#555',};

    return (
        <div>
            <h1 className="title is-4" style={{fontFamily: 'Poppins',fontWeight: 600,color: '#1a1a1a',marginBottom: '0.25rem',}}>
                Registro
            </h1>
            <p style={{fontFamily: 'Poppins', fontWeight: 300, fontSize: '0.875rem', color: '#888', marginBottom: '1.75rem',}}>
                Completa los campos para crear tu cuenta
            </p>
            <form onSubmit={handleSubmit}>
                {/* Campo Nombre(s) */}
                <div className='field'>
                    <label className="label" htmlFor='firstName' style={labelStyle}>
                        <span className='icon is-small'style={{ marginRight: '4px'}}>
                            <IoPersonOutline color="#f59e0b" size={15} />
                        </span>
                        Nombre Completo
                    </label>
                    <div className="control">
                        <input
                            className='input'
                            type="text"
                            placeholder="Nombre(s)"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                            }}
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Campo Apellido(s) */}
                <div className='field'>
                    <label className="label" htmlFor='lastName' style={labelStyle}>
                        <span className='icon is-small'style={{ marginRight: '4px'}}>
                            <IoPersonOutline color="#f59e0b" size={15} />
                        </span>
                        Apellido(s)
                    </label>
                    <div className="control">
                        <input
                            className='input'
                            type="text"
                            placeholder="Apellido(s)"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                            }}
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Campo Matrícula*/}
                <div className='field'>
                    <label className="label" htmlFor='matricula' style={labelStyle}>
                        <span className='icon is-small'style={{ marginRight: '4px'}}>
                            <IoPersonOutline color="#58aed6" size={15} />
                        </span>
                        Matrícula
                    </label>
                    <div className="control">
                        <input
                            className='input'
                            type="number"
                            placeholder="e.g 2231029"
                            id="matricula"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Campo Correo Electrónico*/}
                <div className='field'>
                    <label className="label" htmlFor='email' style={labelStyle}>
                        <span className='icon is-small'style={{ marginRight: '4px'}}>
                            <IoMailOpenOutline color="#f59e0b" size={15} />
                        </span>
                        Correo electrónico
                    </label>
                    <div className="control">
                        <input
                            className="input"
                            type="email"
                            placeholder="e.g. correo@ejemplo.com"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Campo Contraseña */}
                <div className='field'>
                    <label className="label" htmlFor='password' style={labelStyle}>
                        <span className='icon is-small'style={{ marginRight: '4px'}}>
                            <IoLockClosedOutline color="#58aed6" size={15} />
                        </span>
                        Contraseña
                    </label>
                    <div className="control has-icons-right">
                        <input
                            className="input"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="********"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            required
                            style={inputStyle}
                        />
                        <span className="icon is-small is-right" onClick={togglePasswordVisibility} style={{ pointerEvents: 'auto', cursor: 'pointer'}}>
                            {showPassword ? <IoEyeOff size={18} color='#aaa'/> : <IoEye size={18} color='#aaa'/>}
                        </span>
                    </div>
                </div>

                {/* <div className="field">
                    <label className="label" htmlFor="carrera" style={labelStyle}>
                        <span className="icon is-small" style={{ marginRight: '4px' }}>
                            <IoFolderOutline color="#f59e0b" size={15} />
                        </span>
                        Carrera
                    </label>
                    <div className="control">
                        <div className="select is-fullwidth" style={{ borderRadius: '8px' }}>
                            <select
                                id="carrera"
                                value={carrera}
                                onChange={(e) => setCarrera(e.target.value)}
                                required
                                style={{ ...inputStyle, color: carrera === '' ? '#aaa' : '#1a1a1a' }}
                            >
                                <option value="" disabled>Selecciona una carrera</option>
                                <option value="isi">Ing. en Sistemas Computacionales</option>
                                <option value="isc">Ing. en Software</option>
                                <option value="lg">Lic. en Gestión Empresarial</option>
                                <option value="ia">Ing. en Administración</option>
                            </select>
                        </div>
                    </div>
                </div> */}

                {/* Error */}
                {error && (
                    <p className="help is-danger" style={{ fontFamily: 'Poppins', marginBottom: '0.75rem' }}>
                        {error}
                    </p>
                )}

                {/* Botón */}
                <div className="field" style={{ marginTop: '1.25rem' }}>
                    <button
                        className="button is-fullwidth" type="submit" disabled={loading} style={{backgroundColor: '#d81e5b',color: '#ffffff',fontFamily: 'Poppins',fontWeight: 600,fontSize: '0.95rem',borderRadius: '8px',border: 'none',height: '44px',opacity: loading ? 0.75 : 1,transition: 'opacity 0.2s',}}>
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </div>

                {/* Link login */}
                <p className="has-text-centered" style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#888', marginTop: '1rem' }}>
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" style={{ color: '#d81e5b', fontWeight: 500 }}>
                        Iniciar sesión
                    </Link>
                </p>
            </form>
        </div>
    );

}