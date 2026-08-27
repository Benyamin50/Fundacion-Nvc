import { useState, useEffect } from 'react';
import { casosService } from '../../services/casosService';
import { areasService } from '../../services/areasService';
import './Admin.css';

export default function AdminDashboard() {
  const [casos, setCasos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [casosRes, areasRes] = await Promise.all([
        casosService.getAll(),
        areasService.getAll()
      ]);
      setCasos(casosRes.data || []);
      setAreas(areasRes.data || []);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="admin-view">
        <div className="admin-loading">Cargando panel principal...</div>
      </div>
    );
  }

  return (
    <div className="admin-view" style={{ gap: '40px' }}>
      {/* CABECERA */}
      <div className="admin-dashboard-header">
        <h1>Panel de Control</h1>
        <p>Vista general unificada de Casos y Áreas de Apoyo</p>
      </div>

      {/* SECCIÓN 1: CASOS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--admin-text-main)', margin: 0 }}>
            Casos Registrados
          </h2>
          <span className="admin-count">{casos.length} elementos</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Subtítulo</th>
                <th>Destacado</th>
              </tr>
            </thead>
            <tbody>
              {casos.length === 0 ? (
                <tr>
                  <td colSpan="3" className="admin-empty">No hay casos registrados</td>
                </tr>
              ) : (
                casos.slice(0, 5).map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.titulo}</strong></td>
                    <td>{c.subtitulo || '-'}</td>
                    <td>
                      {c.destacado ? (
                        <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                          Destacado
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECCIÓN 2: ÁREAS DE APOYO */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--admin-text-main)', margin: 0 }}>
            Áreas de Apoyo Registradas
          </h2>
          <span className="admin-count">{areas.length} elementos</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Subtítulo</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              {areas.length === 0 ? (
                <tr>
                  <td colSpan="3" className="admin-empty">No hay áreas registradas</td>
                </tr>
              ) : (
                areas.slice(0, 5).map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.titulo}</strong></td>
                    <td>{a.subtitulo || '-'}</td>
                    <td>
                      <span className="admin-cell-with-color">
                        {a.categoria}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}