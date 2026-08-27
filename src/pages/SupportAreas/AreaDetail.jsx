import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import './AreaDetail.css';

export default function AreaDetail() {
  const { slug } = useParams();
  const [categoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  useEffect(() => {
    const fetchAreaDetails = async () => {
      setLoading(true);
      try {
        const response = await publicService.getAreas();
        const allAreas = response.data || [];

        const targetSlug = normalizeText(slug);

        const filtered = allAreas.filter(a => {
          const itemCategoria = normalizeText(a.categoria);
          return itemCategoria === targetSlug || itemCategoria.includes(targetSlug);
        });
        
        setCategoryItems(filtered);
      } catch (error) {
        console.error('Error al cargar detalle de área:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreaDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="area-detail-full-page">
        <div style={{ textAlign: 'center', padding: '180px 0', color: '#64748b' }}>
          Cargando detalles...
        </div>
      </div>
    );
  }

  if (categoryItems.length === 0) {
    return (
      <div className="area-not-found">
        <div className="support-container" style={{ textAlign: 'center', padding: '180px 0' }}>
          <h1>Categoría no encontrada</h1>
          <p style={{ margin: '20px 0' }}>Lo sentimos, la sección "{slug}" no contiene publicaciones actualmente.</p>
          <Link to="/areas-de-apoyo" className="btn-support" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Volver a áreas de apoyo
          </Link>
        </div>
      </div>
    );
  }

  const categoryTitle = categoryItems[0]?.categoria || slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="area-detail-full-page">
      <main className="area-detail-page">
        
        <section className="support-hero">
          <div className="support-container">
            <span className="support-badge">Categoría Oficial</span>
            <h1>Área de <span className="highlight">{categoryTitle}</span></h1>
            <p>Explora todas las iniciativas, programas y publicaciones registradas bajo esta categoría.</p>
          </div>
        </section>

        <section className="support-content">
          <div className="support-container">
            <div className="support-grid">
              {categoryItems.map((item) => (
                <div key={item.id} className="support-card">
                  <div className="support-img-box">
                    <img src={item.imagen_url || item.imagen} alt={item.titulo} />
                    <span className="support-tag" style={{ backgroundColor: '#155263' }}>
                      {item.categoria || 'General'}
                    </span>
                  </div>

                  <div className="support-card-body">
                    <h2>{item.titulo}</h2>
                    <p className="support-desc">{item.subtitulo}</p>
                    <p className="support-detail">{item.descripcion}</p>
                  </div>

                  <div className="support-card-footer">
                    <Link to={`/publicacion/${item.id}`} className="btn-support" style={{ textDecoration: 'none' }}>
                      Leer publicación completa
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}