import { useState, useEffect } from 'react';
import { casosService } from '../../../services/casosService';
import '../Admin.css';

export default function CasosAdmin() {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    descripcion: '',
    destacado: false
  });

  const loadCasos = async () => {
    setLoading(true);
    try {
      const data = await casosService.getAll();
      setCasos(data.data || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar casos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCasos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.destacado) {
        await casosService.quitarDestacadoDeTodos();
      }

      const data = {
        titulo: formData.titulo,
        subtitulo: formData.subtitulo,
        descripcion: formData.descripcion,
        destacado: formData.destacado,
        imagen: selectedFile
      };

      if (editingId) {
        await casosService.update(editingId, data);
        alert('Caso actualizado exitosamente');
      } else {
        await casosService.create(data);
        alert('Caso creado exitosamente');
      }

      setShowForm(false);
      setEditingId(null);
      setSelectedFile(null);
      setFormData({ titulo: '', subtitulo: '', descripcion: '', destacado: false });
      loadCasos();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (caso) => {
    setEditingId(caso.id);
    setFormData({
      titulo: caso.titulo || '',
      subtitulo: caso.subtitulo || '',
      descripcion: caso.descripcion || '',
      destacado: caso.destacado || false
    });
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este caso permanentemente?')) return;

    try {
      await casosService.delete(id);
      alert('Caso eliminado exitosamente');
      loadCasos();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar');
    }
  };

  return (
    <div className="admin-view">
      <div className="admin-view-header">
        <div className="admin-view-title">
          <h1>Casos</h1>
          <span className="admin-count">{casos.length} registros</span>
        </div>
        <button 
          className="admin-add-btn" 
          onClick={() => { 
            setShowForm(true); 
            setEditingId(null); 
            setFormData({ titulo: '', subtitulo: '', descripcion: '', destacado: false });
            setSelectedFile(null);
          }}
          disabled={loading}
        >
          + Nuevo Caso
        </button>
      </div>

      {showForm && (
        <div className="admin-form-modal">
          <div className="admin-form-modal-content">
            <div className="admin-form-modal-header">
              <h2>{editingId ? 'Editar Caso' : 'Nuevo Caso'}</h2>
              <button 
                onClick={() => { setShowForm(false); setEditingId(null); }} 
                className="admin-modal-close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Título *</label>
                  <input 
                    required 
                    value={formData.titulo}
                    onChange={e => setFormData({...formData, titulo: e.target.value})} 
                    placeholder="Ej: Comunidad El Esfuerzo"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Subtítulo</label>
                  <input 
                    value={formData.subtitulo}
                    onChange={e => setFormData({...formData, subtitulo: e.target.value})} 
                    placeholder="Ej: Agua potable para 120 familias"
                  />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Destacado</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '8px' }}>
                    <input 
                      type="checkbox" 
                      id="destacado"
                      checked={formData.destacado}
                      onChange={e => setFormData({...formData, destacado: e.target.checked})} 
                      style={{ width: 'auto' }}
                    />
                    <label htmlFor="destacado" style={{ margin: 0, cursor: 'pointer', fontWeight: 'normal', textTransform: 'none' }}>
                      Marcar como destacado en la web (solo uno a la vez)
                    </label>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Imagen (800 x 460)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => setSelectedFile(e.target.files[0])} 
                  />
                  {selectedFile && (
                    <div style={{ marginTop: '6px' }}>
                      <small style={{ color: '#155263' }}>Archivo seleccionado: {selectedFile.name}</small>
                    </div>
                  )}
                </div>
              </div>
              <div className="admin-form-group">
                <label>Descripción *</label>
                <textarea 
                  required 
                  rows="3"
                  value={formData.descripcion}
                  onChange={e => setFormData({...formData, descripcion: e.target.value})} 
                  placeholder="Descripción detallada del caso..."
                />
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn-save" disabled={loading}>
                  {loading ? 'Procesando...' : editingId ? 'Actualizar' : 'Guardar'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowForm(false); setEditingId(null); }} 
                  className="admin-btn-cancel"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <div className="admin-loading">Cargando datos...</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Subtítulo</th>
              <th>Destacado</th>
              <th>Imagen </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {casos.length === 0 ? (
              <tr>
                <td colSpan="5" className="admin-empty">
                  No hay casos registrados en el sistema
                </td>
              </tr>
            ) : (
              casos.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.titulo}</strong></td>
                  <td>{c.subtitulo || '-'}</td>
                  <td>
                    {c.destacado ? (
                      <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                        ⭐ Destacado
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {c.imagen_url ? (
                      <img 
                        src={c.imagen_url} 
                        alt={c.titulo} 
                        title="Haz clic para ver más grande"
                        onClick={() => setPreviewImage(c.imagen_url)}
                        style={{ 
                          width: '42px', 
                          height: '42px', 
                          objectFit: 'cover', 
                          borderRadius: '6px', 
                          border: '1px solid #cbd5e1', 
                          cursor: 'pointer',
                          transition: 'transform 0.2s'
                        }} 
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Sin imagen</span>
                    )}
                  </td>
                  <td>
                    <button className="admin-btn-edit" onClick={() => handleEdit(c)}>Editar</button>
                    <button className="admin-btn-delete" onClick={() => handleDelete(c.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '85vw',
              maxHeight: '85vh',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>Visualización de imagen</h3>
              <button 
                onClick={() => setPreviewImage(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '8px' }}>
              <img 
                src={previewImage} 
                alt="Caso ampliado" 
                style={{ maxWidth: '75vw', maxHeight: '65vh', objectFit: 'contain', borderRadius: '4px', display: 'block' }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}