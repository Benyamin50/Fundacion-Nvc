import React, { useState, useEffect } from 'react';
import { donacionesService } from '../../../services/donacionesService';
import '../Admin.css';

export default function RegistroPersonas() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadRegistros = async () => {
    setLoading(true);
    try {
      const data = await donacionesService.obtenerTodas();
      
      const mapaAgrupado = {};
      
      (data || []).forEach((item) => {
        const email = item.email ? item.email.toLowerCase() : 'sin-email';
        
        if (!mapaAgrupado[email]) {
          mapaAgrupado[email] = {
            nombre: item.nombre,
            email: email,
            telefono: item.telefono,
            historial: []
          };
        }
        
        mapaAgrupado[email].historial.push({
          tipo: item.tipo_aporte || item.tipoAporte || 'No especificado',
          fecha: item.created_at
        });
      });

      setRegistros(Object.values(mapaAgrupado));
    } catch (error) {
      setError('No se pudieron cargar los registros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRegistros(); }, []);

  if (loading) return <div className="admin-loading">Cargando...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-view">
      <div className="admin-view-header">
        <div className="admin-view-title">
          <h1>Registro de Personas</h1>
          <span className="admin-count">{registros.length} personas únicas</span>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Aportes</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((item) => (
              <React.Fragment key={item.email}>
                <tr 
                  onClick={() => setExpandedId(expandedId === item.email ? null : item.email)} 
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>{item.nombre}</strong></td>
                  <td>{item.email}</td>
                  <td>{item.telefono}</td>
                  <td>
                    <span className="admin-count">{item.historial.length}</span>
                  </td>
                  <td>{expandedId === item.email ? 'Ocultar historial' : 'Ver historial'}</td>
                </tr>
                
                {expandedId === item.email && (
                  <tr>
                    <td colSpan="5" style={{ padding: '24px' }}>
                      <div style={{ maxWidth: '600px' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>
                          Historial detallado
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {item.historial.map((h, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                              <span style={{ fontWeight: 500 }}>{h.tipo}</span>
                              <span style={{ color: '#64748b' }}>
                                {new Date(h.fecha).toLocaleDateString('es-CL', { 
                                  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}