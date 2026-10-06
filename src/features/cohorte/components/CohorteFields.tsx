'use client';

import type { CSSProperties } from 'react';
import { CUATRIMESTRES, GRUPOS, grupoEscolarLabel } from '../utils';
import type { Carrera, CohorteValue } from '../types';

interface CohorteFieldsProps {
    value: CohorteValue;
    onChange: (value: CohorteValue) => void;
    carreras: Carrera[];
    // En el registro la carrera ya tiene su propio campo
    showCarrera?: boolean;
    labelStyle?: CSSProperties;
    selectStyle?: CSSProperties;
    disabled?: boolean;
}

const DEFAULT_LABEL: CSSProperties = { fontFamily: 'Poppins', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '0.35rem' };
const DEFAULT_SELECT: CSSProperties = { fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' };

export function CohorteFields({ value, onChange, carreras, showCarrera = true, labelStyle = DEFAULT_LABEL, selectStyle = DEFAULT_SELECT, disabled = false }: CohorteFieldsProps) {
    const update = (changes: Partial<CohorteValue>) => onChange({ ...value, ...changes });
    const numberOrNull = (raw: string) => (raw ? Number(raw) : null);
    const label = grupoEscolarLabel(carreras, value);
    const carreraSinClave = value.carrera !== null && !carreras.find((carrera) => carrera.id === value.carrera)?.clave;

    return (
        <div>
            {showCarrera && (
                <div className="field">
                    <label style={labelStyle}>Carrera</label>
                    <div className="select is-fullwidth">
                        <select value={value.carrera ?? ''} disabled={disabled} onChange={(e) => update({ carrera: numberOrNull(e.target.value) })} style={selectStyle}>
                            <option value="">Selecciona una opción</option>
                            {carreras.map((carrera) => (
                                <option key={carrera.id} value={carrera.id}>{carrera.nombre}{carrera.clave ? ` (${carrera.clave})` : ''}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="field" style={{ marginBottom: 0 }}>
                    <label style={labelStyle}>Cuatrimestre</label>
                    <div className="select is-fullwidth">
                        <select value={value.cuatrimestre ?? ''} disabled={disabled} onChange={(e) => update({ cuatrimestre: numberOrNull(e.target.value) })} style={selectStyle}>
                            <option value="">—</option>
                            {CUATRIMESTRES.map((numero) => <option key={numero} value={numero}>{numero}°</option>)}
                        </select>
                    </div>
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                    <label style={labelStyle}>Grupo</label>
                    <div className="select is-fullwidth">
                        <select value={value.grupo ?? ''} disabled={disabled} onChange={(e) => update({ grupo: numberOrNull(e.target.value) })} style={selectStyle}>
                            <option value="">—</option>
                            {GRUPOS.map((numero) => <option key={numero} value={numero}>{numero}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            {label && (
                <p style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: '#555', margin: '0.5rem 0 0' }}>
                    Grupo escolar: <strong style={{ color: '#e53e6d' }}>{label}</strong>
                </p>
            )}
            {carreraSinClave && (
                <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#92400e', margin: '0.5rem 0 0' }}>
                    Esta carrera aún no tiene clave registrada; el administrador debe agregarla para armar el grupo.
                </p>
            )}
        </div>
    );
}
