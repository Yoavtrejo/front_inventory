'use client';

import { IoCodeSlash, IoServer, IoLogoGithub,IoMail, IoPeople, IoInformationCircle, IoLayersOutline } from 'react-icons/io5';

const EQUIPO = [
  {
    nombre: 'José Manuel Hernández Reyes',
    icono: '👨🏻‍💼'
  },
  {
    nombre: 'Alma Delia Vite',
    icono: '👩🏻‍💼'
  },
  {
    nombre: 'Miriam Olvera Cuellar',
    icono:  '👩🏻‍💼',
  },
  {
    nombre: 'Yoav Zipacna Trejo Jiménez',
    icono:  '👨🏻‍💻',
  },

  {
    nombre: 'Mara Naomi Bustos Olivares',
    icono:  '👩🏻‍💻',
  },
];

const TECNOLOGIAS_FRONT = [
  { nombre: 'Next.js',    descripcion: 'Framework de React para el frontend' },
  { nombre: 'TypeScript', descripcion: 'Tipado estático para JavaScript'     },
  { nombre: 'Bulma CSS',  descripcion: 'Framework CSS de componentes'        },
];

const TECNOLOGIAS_BACK = [
  { nombre: 'Django',      descripcion: 'Framework web de Python'             },
  { nombre: 'Django REST', descripcion: 'API RESTful para el backend'         },
  { nombre: 'PostgreSQL',  descripcion: 'Base de datos relacional'            },
  { nombre: 'JWT',         descripcion: 'Autenticación con tokens seguros'    },
];

const cardStyle = {background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'1.5rem', boxShadow:'var(--shadow)'};

const sectionTitleStyle = { fontFamily:'Poppins', fontWeight:700, fontSize:'1rem', color:'var(--text)', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem',};

const labelSmall = { fontFamily:'Poppins', fontSize:'0.78rem', fontWeight:600 as const,color:'var(--text-muted)', textTransform:'uppercase' as const, letterSpacing:'0.05em',};

export function AcercaDe() {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.75rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
          Acerca de
        </h1>
        <p style={{ fontFamily: 'Poppins', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Información general del sistema y el equipo de desarrollo.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        <div style={{ background:'linear-gradient(135deg, #f97316, #e53e6d)', borderRadius:'16px', padding:'2.5rem 2rem', color:'#fff', display:'flex', alignItems:'center', gap:'1.5rem' }}>

          <div style={{ width: 72, height: 72, borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IoLayersOutline size={40} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.75rem', margin: 0 }}>
              SIDERED
            </h2>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.9rem', opacity: 0.9, margin: '0.4rem 0 0', lineHeight: 1.6 }}>
              Sistema de Gestión de Laboratorio de Redes
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '0.2rem 0.75rem', fontSize: '0.78rem', fontFamily: 'Poppins', fontWeight: 600 }}>
                Versión 1.0
              </span>
              <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '0.2rem 0.75rem', fontSize: '0.78rem', fontFamily: 'Poppins', fontWeight: 600 }}>
                Universidad Politécnica de Tulancingo
              </span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>
            <IoInformationCircle size={20} color="#f97316" />
            Descripción del sistema
          </h3>
          <p style={{ fontFamily: 'Poppins', fontSize: '0.9rem', color: '#555', lineHeight: 1.8, margin: 0 }}>
            SIDERED es un sistema de gestión de inventarios diseñado para facilitar el control de materiales y préstamos
            dentro del laboratorio de redes. Permite a los docentes registrar actividades y asignarlas a grupos o alumnos
            según la clase correspondiente, mientras que los alumnos pueden consultar sus actividades, solicitar préstamos
            de materiales y reservar islas de trabajo. El sistema centraliza la administración del laboratorio en una sola
            plataforma accesible para administradores, docentes y alumnos.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              <IoPeople size={20} color="#f97316" /> Equipo de desarrollo
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {EQUIPO.map((miembro) => (
                <div
                  key={miembro.nombre}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--surface-soft)', border: '1px solid var(--border)', borderRadius: '12px' }}
                >
                  <span style={{ fontSize: '2rem', flexShrink: 0 }}>{miembro.icono}</span>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', margin: 0 }}>
                      {miembro.nombre}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              <IoCodeSlash size={20} color="#f97316" /> Tecnologías utilizadas
            </h3>

            <p style={labelSmall}>Frontend</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
              {TECNOLOGIAS_FRONT.map((t) => (
                <div key={t.nombre} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#fff7ed', borderRadius: '8px', borderLeft: '3px solid #f97316' }}>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a' }}>
                    {t.nombre}
                  </span>
                  <span style={{ fontFamily: 'Poppins', fontSize: '0.75rem', color: '#888' }}>
                    {t.descripcion}
                  </span>
                </div>
              ))}
            </div>

            <p style={labelSmall}>Backend</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              {TECNOLOGIAS_BACK.map((t) => (
                <div key={t.nombre} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#fdf2f8', borderRadius: '8px', borderLeft: '3px solid #e53e6d' }}>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a' }}>
                    {t.nombre}
                  </span>
                  <span style={{ fontFamily: 'Poppins', fontSize: '0.75rem', color: '#888' }}>
                    {t.descripcion}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>
            <IoMail size={20} color="#f97316" />
            Contacto y soporte
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--surface-soft)', border: '1px solid var(--border)', borderRadius: '12px', width: 'fit-content' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #e53e6d)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IoMail size={22} color="#fff" />
            </div>
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', margin: 0 }}>
                Soporte técnico
              </p>
              <a
                href="mailto:2230294@upt.edu.mx"
                style={{ fontFamily: 'Poppins', fontSize: '0.875rem', color: '#e53e6d', fontWeight: 500, textDecoration: 'none' }}
              >
                2230294@upt.edu.mx
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}