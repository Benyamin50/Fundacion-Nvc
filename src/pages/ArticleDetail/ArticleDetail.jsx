import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicService } from '../../services/publicService';  // 🔥 CAMBIADO
import './ArticleDetail.css';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      setLoading(true);
      try {
        const [areasRes, casosRes] = await Promise.all([
          publicService.getAreas(),   // 🔥 CAMBIADO
          publicService.getCasos()    // 🔥 CAMBIADO
        ]);

        const areas = (areasRes.data || []).map(a => ({
          ...a,
          tipoTag: a.categoria || 'Área de Apoyo',
          urlId: String(a.id)
        }));

        const casos = (casosRes.data || []).map(c => ({
          ...c,
          tipoTag: 'Caso',
          urlId: `caso-${c.id}`
        }));

        const allItems = [...areas, ...casos];

        const found = allItems.find(item =>
          String(item.urlId) === String(id) || String(item.id) === String(id)
        );

        setArticle(found || null);
      } catch (error) {
        console.error('Error al cargar la publicación:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="article-full-page">
        <div style={{ textAlign: 'center', padding: '180px 0', color: '#64748b' }}>
          Cargando publicación...
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-not-found">
        <h2>Publicación no encontrada</h2>
        <p style={{ margin: '15px 0', color: '#64748b' }}>El elemento que intentas ver no existe o fue eliminado.</p>
        <Link to="/areas-de-apoyo" className="btn-article-back">Volver al inicio</Link>
      </div>
    );
  }

  const imagenFondo = article.imagen_url || article.imagen || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop";

  return (
    <div className="article-full-page">
      <main className="article-page">

        <section
          className="article-hero"
          style={{ backgroundImage: `url(${imagenFondo})` }}
        >
          <div className="article-hero-overlay"></div>
          <div className="article-hero-content">
            <span
              className="article-category-tag"
              style={{ backgroundColor: article.color || '#155263', color: '#ffffff' }}
            >
              {article.tipoTag}
            </span>
            <h1 className="article-main-title">{article.titulo}</h1>
          </div>
        </section>

        <section className="article-body-section">
          <div className="article-container">
            <div className="article-content">
              <div className="article-text">
                <p className="article-lead">{article.subtitulo || 'Detalle principal de la iniciativa'}</p>
                <p style={{ lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-line' }}>
                  {article.descripcion}
                </p>
                <p style={{ marginTop: '30px', color: '#64748b', fontSize: '0.95rem', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  Desde Barquisimeto, Venezuela, la Fundación Nueva Vida en Cristo dice presente en la comunidad, tendiendo una mano amiga y llevando esperanza real a quienes más lo necesitan.
                </p>
              </div>

              <div className="article-actions">
                <Link to="/casos" className="btn-article-outline">
                  Ver más Casos
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}