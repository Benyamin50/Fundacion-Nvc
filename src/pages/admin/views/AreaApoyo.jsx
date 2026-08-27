import { useState, useEffect } from 'react';
import { areasService } from '../../../services/areasService';
import '../Admin.css';

export default function AreaApoyo() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    categoria: 'Salud',
    descripcion: ''
  });

  const loadAreas = async () => {
    setLoading(true);
    try {
      const data = await areasService.getAll();
      setAreas(data.data || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar áreas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        titulo: formData.titulo,
        subtitulo: formData.subtitulo,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        imagen: selectedFile
      };

      if (editingId) {
        await areasService.update(editingId, data);
        alert('Área actualizada exitosamente');
      } else {
        await areasService.create(data);
        alert('Área creada exitosamente');
      }

      setShowForm(false);
      setEditingId(null);
      setSelectedFile(null);
      setFormData({ titulo: '', subtitulo: '', categoria: 'Salud', descripcion: '' });
      loadAreas();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (area) => {
    setEditingId(area.id);
    setFormData({
      titulo: area.titulo || '',
      subtitulo: area.subtitulo || '',
      categoria: area.categoria || 'Salud',
      descripcion: area.descripcion || ''
    });
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta área permanentemente?')) return;

    try {
      await areasService.delete(id);
      alert('Área eliminada exitosamente');
      loadAreas();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar');
    }
  };

  return (
    <div className="admin-view">
      <div className="admin-view-header">
        <div className="admin-view-title">
          <h1>Áreas de Apoyo</h1>
          <span className="admin-count">{areas.length} registros</span>
        </div>
        <button 
          className="admin-add-btn" 
          onClick={() => { 
            setShowForm(true); 
            setEditingId(null); 
            setFormData({ titulo: '', subtitulo: '', categoria: 'Salud', descripcion: '' });
            setSelectedFile(null);
          }}
          disabled={loading}
        >
          + Nueva Área
        </button>
      </div>

      {showForm && (
        <div className="admin-form-modal">
          <div className="admin-form-modal-content">
            <div className="admin-form-modal-header">
              <h2>{editingId ? 'Editar Área' : 'Nueva Área'}</h2>
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
                    placeholder="Ej: Educación"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Subtítulo</label>
                  <input 
                    value={formData.subtitulo}
                    onChange={e => setFormData({...formData, subtitulo: e.target.value})} 
                    placeholder="Ej: Transformando vidas"
                  />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Categoría *</label>
                  <select 
                    value={formData.categoria}
                    onChange={e => setFormData({...formData, categoria: e.target.value})}
                  >
                    <option>Salud</option>
                    <option>Educación</option>
                    <option>Social</option>
                    <option>Capacitación</option>  {/* 🔥 NUEVA CATEGORÍA */}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Imagen</label>
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
                  placeholder="Descripción detallada..."
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
              <th>Categoría</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {areas.length === 0 ? (
              <tr>
                <td colSpan="5" className="admin-empty">
                  No hay áreas registradas en el sistema
                </td>
              </tr>
            ) : (
              areas.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.titulo}</strong></td>
                  <td>{a.subtitulo || '-'}</td>
                  <td>
                    <span className="admin-cell-with-color">
                      {a.categoria}
                    </span>
                  </td>
                  <td>
                    {a.imagen_url ? (
                      <img 
                        src={a.imagen_url} 
                        alt={a.titulo} 
                        title="Haz clic para ver más grande"
                        onClick={() => setPreviewImage(a.imagen_url)}
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
                    <button className="admin-btn-edit" onClick={() => handleEdit(a)}>Editar</button>
                    <button className="admin-btn-delete" onClick={() => handleDelete(a.id)}>Eliminar</button>
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
                alt="Área ampliada" 
                style={{ maxWidth: '75vw', maxHeight: '65vh', objectFit: 'contain', borderRadius: '4px', display: 'block' }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}