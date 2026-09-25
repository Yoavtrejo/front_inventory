'use client';

import { useRef } from "react";
import { IoSearch, IoDownload, IoDocumentText, IoShieldCheckmark, IoCalendar } from "react-icons/io5";
import { useReportes } from "../hooks/useReportes";
import { exportarCSV, exportarPDF } from "../utils/exportar";
import type { LoanHistory } from "../types";
import type { Reservacion } from "@/features/islas/types";

function TablaHistorial({ datos, id } : {datos: LoanHistory[]; id:string }) {
  return (
    <div id={id} style={{ overflowX: 'auto'}}>
      <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
        <thead>
          <tr style={{ background:'linear-gradient(135deg, #f97316, #e53e6d)' }}>
            {['ID', 'Material', 'Cantidad', 'Solicitante', 'Autorizado por', 'Fecha préstamo', 'Fecha devolución', 'Días'].map((h) => (
              <th key={h} style={{ padding:'0.75rem 1rem', color:'#fff', fontFamily:'Poppins', fontSize:'0.78rem', fontWeight:700, textAlign:'left', whiteSpace:'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ padding:'2rem', textAlign:'center', fontFamily:'Poppins', color:'#AAA' }}>
                Sin registros
              </td>
            </tr>
          ) : datos.map((h,i) => (
            <tr key={h.id} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA', borderBottom:'1px solid #F5F5F5' }}>
              <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', color:'#888' }}>{h.original_loand_id}</td>
              <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', fontWeight:600, color:'#1A1A1A' }}>{h.material_name}</td>
              <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', color:'#555' }}>{h.quantity}</td>
              <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', color:'#555' }}>{h.requested_by_username}</td>
              <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', color:'#555' }}>{h.approved_by_username}</td>
              <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', color:'#555' }}>{h.loan_date}</td>
              <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', color:'#555' }}>{h.return_date}</td>
              <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', color:'#555' }}>{h.loan_period_days}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TablaReservaciones({ datos, id }: { datos: Reservacion[]; id: string }) {
  const getEstado = (r: Reservacion) => {
    if (r.cancelada) return { label: 'Cancelada', bg:'#FEE2E2', color:'#991B1B' };
      if (r.completada) return { label: 'Completada', bg:'#DBEAFE', color:'#065F46' };
      return { label:'Activa', bg:'#D1FAE5', color:'#065F46' };
  };

  return (
    <div id={id} style={{ overflowX:'auto'}}>
      <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
        <thead>
          <tr style={{ background:'linear-gradient(135deg, #f97316, #e53e6d)' }}>
            {['ID', 'Isla', 'Alumno', 'Fecha', 'Hora inicio', 'Duración', 'Estado'].map((h) => (
              <th key={h} style={{ padding:'0.75rem 1rem', color:'#fff', fontFamily:'Poppins', fontSize:'0.78rem', fontWeight:700, textAlign:'left', whiteSpace:'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding:'2rem', textAlign:'center', fontFamily:'Poppins', color:'#AAA' }}>
                Sin registros
              </td>
            </tr>
          ) : datos.map((r,i) => {
            const estado = getEstado(r);

            return (
              <tr key={r.id} style={{ background:i % 2 === 0 ? '#FFF' : '#FAFAFA', borderBottom:'1px solid #F5F5F5' }}>
                <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', color:'#888' }}>{r.id}</td>
                <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', fontWeight:600, color:'#1A1A1A' }}>Isla #{r.isla_detalles.numero_isla}</td>
                <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', color:'#555' }}>{r.alumno.first_name} {r.alumno.last_name}</td>
                <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', color:'#555' }}>{r.fecha_reserva}</td>
                <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', color:'#555' }}>{r.hora_inicio.slice(0, 5)}</td>
                <td style={{ padding:'0.75rem 1rem', fontFamily:'Poppins', fontSize:'0.85rem', color:'#555' }}>{r.duracion_horas}</td>
                <td style={{ padding:'0.75rem 1rem' }}>
                  <span style={{ background:estado.bg, color:estado.color, fontFamily:'Poppins', fontSize:'0.72rem', fontWeight:600, borderRadius:'20px', padding:'0.2rem 0.6rem' }}>
                    {estado.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function Reportes() {
  const { pestana, setPestana, loading, search, setSearch, historialFiltrado,condReportes, reservacionesFIltradas } = useReportes();

  const PESTANAS = [
    { key:'prestamos', label:'Historial de Préstamos', icon: IoDocumentText },
    { key:'condicion', label:'Reportes de Condición', icon: IoShieldCheckmark },
    { key:'islas', label:'Reservaciones de Islas', icon: IoCalendar}
  ] as const;

  const handleExportCSV = () => {
    if (pestana === 'prestamos') {
      exportarCSV(historialFiltrado.map((h) => ({
        'ID Préstamo': h.original_loand_id,
        'Material': h.material_name,
        'Cantidad': h.quantity,
        'Solicitante': h.requested_by_username,
        'Autorizado por': h.approved_by_username,
        'Fecha préstamo': h.loan_date,
        'Devolución': h.return_date,
        'Días': h.loan_period_days,
      })), 'historial_prestamos');
    } else if (pestana === 'islas') {
      exportarCSV(reservacionesFIltradas.map((r) => ({
        'ID': r.id,
        'Isla': `Isla #${r.isla_detalles.numero_isla}`,
        'Alumno': `${r.alumno.first_name} ${r.alumno.last_name}`,
        'Fecha': r.fecha_reserva,
        'Hora': r.hora_inicio.slice(0, 5),
        'Duración': `${r.duracion_horas}h`,
        'Completada': r.completada ? 'Sí' : 'No',
        'Cancelada': r.cancelada  ? 'Sí' : 'No',
      })), 'historial_islas');
    }
  };

  const handleExportPDF = () => {
    const nombres: Record<string, string> = {
      prestamos: 'Historial de Préstamos',
      condicion: 'Reportes de Condición',
      islas: 'Reservaciones de Islas',
    };
    
    exportarPDF(`tabla-${pestana}`, nombres[pestana]);
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontFamily:'Poppins', fontWeight: 700, fontSize:'1.75rem', color:'#1a1a1a', marginBottom:'0.25rem' }}>
            Reportes
          </h1>
          <p style={{ fontFamily: 'Poppins', color:'#888', fontSize:'0.875rem' }}>
            Consulta y exporta el historial del sistema.
          </p>
        </div>

        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button
            onClick={handleExportCSV}
            style={{ background:'#fff', color:'#065f46', fontFamily:'Poppins', fontWeight:600, fontSize:'0.85rem', border:'1px solid #bbf7d0', borderRadius:'10px', padding:'0.6rem 1rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem' }}
          >
            <IoDownload size={16} /> Excel / CSV
          </button>
          <button
            onClick={handleExportPDF}
            style={{ background:'#fff', color:'#991b1b', fontFamily:'Poppins', fontWeight:600, fontSize:'0.85rem', border:'1px solid #fecaca', borderRadius:'10px', padding:'0.6rem 1rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.4rem' }}
          >
            <IoDownload size={16} /> PDF / Imprimir
          </button>
        </div>
      </div>

      <div style={{ background:'#fff', borderRadius:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }}>

        <div style={{ display:'flex', borderBottom:'1px solid #f0f0f0' }}>
          {PESTANAS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setPestana(key); setSearch(''); }}
              style={{
                flex:1,
                padding:'1rem',
                fontFamily:'Poppins',
                fontWeight:pestana === key ? 700 : 400,
                fontSize:'0.875rem',
                color:pestana === key ? '#e53e6d' : '#888',
                background:'none',
                border:'none',
                borderBottom:pestana === key ? '2px solid #e53e6d' : '2px solid transparent',
                cursor:'pointer',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                gap:'0.5rem',
                transition:'all 0.15s',
              }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid #f5f5f5' }}>
          <div className="control has-icons-left" style={{ maxWidth: '360px' }}>
            <input
              className="input"
              type="text"
              placeholder={
                pestana === 'prestamos' ? 'Buscar por material o usuario...' :
                pestana === 'condicion' ? 'Buscar por usuario...' :
                'Buscar por isla o alumno...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontFamily:'Poppins', borderRadius:'10px' }}
            />
            <span className="icon is-left"><IoSearch color="#aaa" /></span>
          </div>
        </div>

        <div style={{ padding:'0' }}>
          {loading ? (
            <div style={{ padding:'3rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ height:'44px', borderRadius:'8px', background:'#f0f0f0' }} />
              ))}
            </div>
          ) : (
            <>
              {pestana === 'prestamos' && (
                <TablaHistorial datos={historialFiltrado} id="tabla-prestamos" />
              )}

              {pestana === 'condicion' && (
                <div id="tabla-condicion" style={{ padding: '1rem 1.5rem' }}>
                  {condReportes.length === 0 ? (
                    <p style={{ fontFamily:'Poppins', color:'#aaa', textAlign:'center', padding:'2rem' }}>
                      No hay reportes de condición registrados.
                    </p>
                  ) : (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'1rem' }}>
                      {condReportes.map((r) => (
                        <div
                          key={r.id}
                          style={{ background:'#fafafa', borderRadius:'12px', padding:'1rem', border:'1px solid #f0f0f0' }}
                        >
                          {r.photo && (
                            <img
                              src={r.photo}
                              alt="Condición del material"
                              style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' }}
                            />
                          )}
                          <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a', margin: '0 0 0.25rem' }}>
                            Préstamo #{r.loan}
                          </p>
                          <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#888', margin: '0 0 0.5rem' }}>
                            Por: {r.user.first_name} {r.user.last_name}
                          </p>
                          <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#555', margin: 0, lineHeight: 1.6 }}>
                            {r.description || 'Sin descripción'}
                          </p>
                          <p style={{ fontFamily: 'Poppins', fontSize: '0.75rem', color: '#aaa', margin: '0.5rem 0 0' }}>
                            {new Date(r.created_at).toLocaleString('es-MX')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {pestana === 'islas' && (
                <TablaReservaciones datos={reservacionesFIltradas} id="tabla-islas" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
