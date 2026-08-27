import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import { useLoading } from '../../context/LoadingContext';
import './Home.css';

// IMPORTAR ARCHIVOS ESTÁTICOS
import videoGuaira from '/guaira.mp4';
import imgDestruccion from '/images/destruccion.png';
import fotoBenja from '/images/foto-benja.jpeg';

// SLIDES DEL HERO - FRASES DINÁMICAS
const heroSlides = [
  {
    id: 1,
    type: 'video',
    mediaUrl: videoGuaira,
    thumbUrl: imgDestruccion,
    line1: 'Haciendo',
    line2: 'tangible el amor'
  },
  {
    id: 2,
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop',
    thumbUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=200&auto=format&fit=crop',
    line1: 'Mejoremos',
    line2: 'vidas juntos'
  },
  {
    id: 3,
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop',
    thumbUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=200&auto=format&fit=crop',
    line1: 'Unidos',
    line2: 'hacemos más'
  }
];

// Animación de los números de las estadísticas
function StatCounter({ target, prefix = '', suffix = '', useDot = false }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCount(0);
          const duration = 2000;
          const startTime = performance.now();

          const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easeOut * target);
            setCount(currentCount);
            if (progress < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.2 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [target]);

  const formatted = useDot ? count.toLocaleString('es-CL') : count;
  return <span ref={elementRef}>{prefix}{formatted}{suffix}</span>;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCase, setCurrentCase] = useState(0);
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoading, hideLoading } = useLoading();

  // Cargar casos
  useEffect(() => {
    const fetchCasos = async () => {
      showLoading();
      try {
        const response = await publicService.getCasos();
        setCasos(response.data || []);
      } catch (error) {
        console.error('Error cargando casos en Home:', error);
      } finally {
        setLoading(false);
        hideLoading();
      }
    };
    fetchCasos();
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const nextCase = () => setCurrentCase((prev) => (casos.length > 0 ? (prev === casos.length - 1 ? 0 : prev + 1) : 0));
  const prevCase = () => setCurrentCase((prev) => (casos.length > 0 ? (prev === 0 ? casos.length - 1 : prev - 1) : 0));

  const scrollToQuote = () => {
    const quoteSection = document.getElementById('quote-section');
    if (quoteSection) quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeSlideData = heroSlides[currentSlide];

  return (
    <main className="home-page page-transition">
      
      {/* Estilo incrustado solo para quitar la línea azul en la sección de áreas */}
      <style>{`
        .hide-line::after, .hide-line::before { display: none !important; }
        .hide-line { background-image: none !important; border-bottom: none !important; text-decoration: none !important; }
      `}</style>

      <section className="hero-section">
        {activeSlideData.type === 'video' ? (
          <video
            key={activeSlideData.mediaUrl}
            className="hero-media"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={activeSlideData.mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            key={activeSlideData.mediaUrl}
            src={activeSlideData.mediaUrl}
            alt="Fondo de la fundación"
            className="hero-media"
          />
        )}

        <div className="hero-overlay-video"></div>

        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-top-line">{activeSlideData.line1}</span><br />
            <span className="hero-highlight">{activeSlideData.line2}</span>
          </h1>
        </div>

        <div className="hero-bottom-ui">
          <div className="hero-nav-controls">
            <button className="hero-arrow-btn" onClick={prevSlide} aria-label="Anterior">&#10094;</button>
            <div className="hero-video-lines">
              {heroSlides.map((slide, index) => (
                <span
                  key={slide.id}
                  className={`video-line ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            <button className="hero-arrow-btn" onClick={nextSlide} aria-label="Siguiente">&#10095;</button>
          </div>

          <div className="hero-thumbnails">
            {heroSlides.map((slide, index) => (
              <img
                key={slide.id}
                src={slide.thumbUrl}
                alt={`Miniatura ${slide.id}`}
                className={`thumb ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          <div className="hero-scroll-down" onClick={scrollToQuote}>
            Descubre más <span className="arrow-down">↓</span>
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN 2: CITA Y ÁREAS DE APOYO ===== */}
      <section className="quote-section" id="quote-section">
        <div className="quote-grid">
          <div className="quote-content-box">
            <blockquote className="quote-text">
              “Queremos generar un cambio positivo en las personas, mejorar su calidad de vida y tenderles una mano cuando atraviesan dificultades”.
            </blockquote>
            <div className="quote-author-box">
              <span className="author-name">Pastor Raúl C.</span>
              <span className="author-dots">...</span>
            </div>
          </div>
          <div className="quote-image-box">
            <img src={fotoBenja} alt="Fundación Te Apoyamos" />
          </div>
        </div>

        <div className="areas-container" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 className="areas-title" style={{ lineHeight: '1.2' }}>
            <span className="hero-top-line" style={{ color: '#155263', display: 'block', marginBottom: '10px' }}>
              Áreas en las que
            </span>
            {/* AQUÍ APLICAMOS LA CLASE hide-line PARA QUITAR LA LÍNEA AZUL */}
            <span className="hero-highlight hide-line" style={{ fontSize: '1.2em' }}>
              realizamos nuestras ayudas
            </span>
          </h2>
        </div>

        <div className="areas-grid-container">
          <div className="areas-grid">
            <Link to="/areas-de-apoyo/educacion" className="area-card" style={{ textDecoration: 'none' }}>
              <div className="area-img-box"><img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop" alt="Educación" /></div>
              <div className="area-label area-education">EDUCACIÓN</div>
            </Link>

            <Link to="/areas-de-apoyo/salud" className="area-card" style={{ textDecoration: 'none' }}>
              <div className="area-img-box"><img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop" alt="Salud" /></div>
              <div className="area-label area-health">SALUD</div>
            </Link>

            <Link to="/areas-de-apoyo/social" className="area-card" style={{ textDecoration: 'none' }}>
              <div className="area-img-box"><img src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=600&auto=format&fit=crop" alt="Social" /></div>
              <div className="area-label area-social">SOCIAL</div>
            </Link>

            <Link to="/areas-de-apoyo/capacitacion" className="area-card" style={{ textDecoration: 'none' }}>
              <div className="area-img-box"><img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop" alt="Capacitación" /></div>
              <div className="area-label area-capacitacion">CAPACITACIÓN</div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN 4: ¿CÓMO DONAR? ===== */}
      <section className="how-to-apply-section">
        <div className="apply-container">
          <h2 className="apply-main-title">¿Cómo Donar?</h2>
          <div className="apply-steps-grid">
            <div className="apply-step-item">
              <span className="step-number">1</span>
              <p className="step-text">Completa el formulario <Link to="/dona" className="step-link">aquí</Link>.</p>
            </div>
            <div className="apply-step-item">
              <span className="step-number">2</span>
              <p className="step-text">Te contactaremos para más detalles.</p>
            </div>
            <div className="apply-step-item">
              <span className="step-number">3</span>
              <p className="step-text">Te informaremos el resultado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN 5: VIDEO INSTITUCIONAL ===== */}
      <section className="video-section">
        <div className="video-container">
          <div className="video-wrapper">
            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Presentación" allowFullScreen></iframe>
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN 6: ESTADÍSTICAS ===== */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number stat-red"><StatCounter target={8000} prefix="+" /></span>
              <span className="stat-label">Apoyos concretados</span>
            </div>
            <div className="stat-item">
              <span className="stat-number stat-blue"><StatCounter target={76} suffix="%" /></span>
              <span className="stat-label">Son beneficiarias mujeres</span>
            </div>
            <div className="stat-item">
              <span className="stat-number stat-purple"><StatCounter target={78} suffix="%" /></span>
              <span className="stat-label">Son casos fuera de la capital</span>
            </div>
            <div className="stat-item">
              <span className="stat-number stat-yellow"><StatCounter target={10750} prefix="$" useDot={true} /></span>
              <span className="stat-label">Aportes recibidos</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN 7: AYUDAS DE AMOR ===== */}
      <section className="news-section">
        <div className="news-container">
          <div className="news-header-top">
            <h2 className="news-main-title">Ayudas de Amor</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Cargando ayudas...</div>
          ) : casos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No hay ayudas disponibles en este momento.</div>
          ) : (
            <div className="news-grid">

              <div className="news-content-box">
                <h3 className="news-headline">{casos[currentCase]?.titulo}</h3>
                <p className="news-description">{casos[currentCase]?.subtitulo || casos[currentCase]?.descripcion}</p>

                <div className="news-actions-wrap">
                  <Link to={`/publicacion/caso-${casos[currentCase]?.id}`} className="news-read-more">Leer historia</Link>
                  <Link to="/casos" className="news-all-btn">Ver todas las ayudas</Link>
                </div>
              </div>

              <div className="news-slider-box">
                <button className="slider-arrow slider-prev" onClick={prevCase} aria-label="Anterior">&#10094;</button>

                <div className="news-image-wrapper">
                  <img
                    src={casos[currentCase]?.imagen_url || casos[currentCase]?.imagen}
                    alt={casos[currentCase]?.titulo}
                  />
                </div>

                <button className="slider-arrow slider-next" onClick={nextCase} aria-label="Siguiente">&#10095;</button>

                <div className="news-indicators">
                  {casos.map((_, index) => (
                    <span
                      key={index}
                      className={`news-dot ${index === currentCase ? 'active' : ''}`}
                      onClick={() => setCurrentCase(index)}
                    ></span>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </section>
    </main>
  );
}