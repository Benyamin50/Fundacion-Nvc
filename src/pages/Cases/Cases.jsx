import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicService } from '../../services/publicService';  // 🔥 CAMBIADO
import './Cases.css';

export default function Cases() {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasos = async () => {
      try {
        const response = await publicService.getCasos();  // 🔥 CAMBIADO
        setCasos(response.data || []);
      } catch (error) {
        console.error('Error al cargar los casos públicos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCasos();
  }, []);

  if (loading) {
    return (
      <div className="cases-full-page">
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
          Cargando historias...
        </div>
      </div>
    );
  }

  const featuredCase = casos.find(c => c.destacado) || casos[0];
  const gridCases = featuredCase 
    ? casos.filter(c => c.id !== featuredCase.id) 
    : casos;

  return (
    <div className="cases-full-page page-transition"> {/* 🔥 AGREGA LA CLASE AQUÍ */}
      <main className="cases-page">
        
        <section className="cases-hero">
          <div className="cases-container">
            <span className="cases-badge">Historias Reales</span>
            <h1>Casos</h1>
            <p>Conoce cómo nuestro trabajo transforma comunidades, familias y proyectos de vida.</p>
          </div>
        </section>

        {featuredCase && (
          <section className="featured-case-section">
            <div className="cases-container">
              <div className="featured-case-card">
                <div className="featured-img-box">
                  <img src={featuredCase.imagen_url || featuredCase.imagen} alt={featuredCase.titulo} />
                  <span className="featured-tag">Destacado</span>
                </div>
                <div className="featured-body">
                  <span className="featured-badge-label">Historia Principal</span>
                  <h2>{featuredCase.titulo}</h2>
                  <p>{featuredCase.descripcion}</p>
                  <Link to={`/publicacion/caso-${featuredCase.id}`} className="btn-case featured-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    Leer historia completa
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="cases-content">
          <div className="cases-container">
            {casos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No hay casos publicados en este momento.
              </div>
            ) : (
              <div className="cases-grid">
                {gridCases.map((caso) => (
                  <div key={caso.id} className="case-card">
                    <div className="case-img-box">
                      <img src={caso.imagen_url || caso.imagen} alt={caso.titulo} />
                    </div>

                    <div className="case-card-body">
                      <h2>{caso.titulo}</h2>
                      <p>{caso.descripcion}</p>
                    </div>

                    <div className="case-card-footer">
                      <Link to={`/publicacion/caso-${caso.id}`} className="btn-case" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        Leer más
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}