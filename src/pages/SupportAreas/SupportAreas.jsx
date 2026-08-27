import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import { useLoading } from '../../context/LoadingContext';
import './SupportAreas.css';

export default function SupportAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const fetchAreas = async () => {
      showLoading();
      
      try {
        const response = await publicService.getAreas();
        setAreas(response.data || []);
      } catch (error) {
        console.error('Error al cargar las áreas de apoyo públicas:', error);
      } finally {
        setLoading(false);
        hideLoading();
      }
    };

    fetchAreas();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="support-full-page page-transition">
      <main className="support-page">
        
        {/* HERO */}
        <section className="support-hero">
          <div className="support-container">
            <span className="support-badge">Nuestras Iniciativas</span>
            <h1>Áreas de <span className="highlight">Apoyo</span></h1>
            <p>Explora todas las publicaciones y programas que llevamos adelante.</p>
          </div>
        </section>

        {/* GRID GENERAL CON TODAS LAS PUBLICACIONES */}
        <section className="support-content">
          <div className="support-container">
            {areas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No hay áreas registradas en este momento.
              </div>
            ) : (
              <div className="support-grid">
                {areas.map((item) => (
                  <Link 
                    to={`/publicacion/${item.id}`} 
                    key={item.id} 
                    className="support-card"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="support-img-box">
                      <img src={item.imagen_url || item.imagen} alt={item.titulo} />
                      <span className="support-tag" style={{ backgroundColor: item.color || '#155263', color: '#ffffff' }}>
                        {item.categoria || 'General'}
                      </span>
                    </div>

                    <div className="support-card-body">
                      <h2>{item.titulo}</h2>
                      <p className="support-desc">{item.subtitulo || item.descripcion}</p>
                      <p className="support-detail">{item.descripcion}</p>
                    </div>

                    <div className="support-card-footer">
                      <span className="btn-support" style={{ display: 'inline-block' }}>
                        Leer publicación completa
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}