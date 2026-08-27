import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { navigateWithLoading } = useLoading();
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    navigateWithLoading(navigate, path, 400);
  };

  return (
    <footer className="footer-section">
      <div className="footer-glow-bg"></div>

      <div className="footer-container">
        
        <div className="footer-main-grid">
          
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo-link" onClick={() => handleLinkClick('/')}>
              <img 
                src={`${import.meta.env.BASE_URL}images/Logo Fundacion Bolsos color.webp`} 
                alt="Fundación NVC" 
                className="footer-logo-img" 
              />
            </Link>
            
            <p className="footer-brand-desc">
              Transformando historias y construyendo un futuro con más oportunidades.
            </p>

            <div className="footer-social-icons">
              <a 
                href="https://www.facebook.com/profile.php?id=61591708384387" 
                className="social-btn" 
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a 
                href="https://www.instagram.com/fundacionnvc2019/" 
                className="social-btn" 
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          <div className="footer-col nav-col">
            <h4 className="footer-col-title">Navegación</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/quienes-somos" className="footer-link" onClick={() => handleLinkClick('/quienes-somos')}>Quiénes somos</Link>
              </li>
              <li>
                <Link to="/areas-de-apoyo" className="footer-link" onClick={() => handleLinkClick('/areas-de-apoyo')}>Áreas de apoyo</Link>
              </li>
              <li>
                <Link to="/casos" className="footer-link" onClick={() => handleLinkClick('/casos')}>Noticias y Casos</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h4 className="footer-col-title">Contacto</h4>
            <ul className="footer-clean-contact">
              <li>
                <svg className="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <a href="mailto:fundacionnvc.2019@gmail.com">fundacionnvc.2019@gmail.com</a>
              </li>
              <li>
                <svg className="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <a href="tel:+593962935416">+593 96 293 5416</a>
              </li>
              <li>
                <svg className="contact-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>Calle 1 de Cerritos Blanco entre Vereda 6 y 7 de Ruiz Pineda 1, Barquisimeto, Venezuela, 3001</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom-bar">
          <p className="footer-copy">
            © 2019 - {currentYear} <span className="copy-brand">Fundación NVC</span>. Todos los derechos reservados.
          </p>
          
        </div>

      </div>
    </footer>
  );
}