import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { navigateWithLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    const scrollContainer = document.getElementById('root');

    const handleScroll = () => {
      setScrolled(scrollContainer.scrollTop > 50);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleLinkClick = (path) => {
    setMenuOpen(false);
    setDropdownOpen(false);
    navigateWithLoading(navigate, path, 400);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) setMenuOpen(false);
    };
    
    const scrollContainer = document.getElementById('root');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [menuOpen]);

  return (
    <>
      <div className={`menu-overlay ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)}></div>

      <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          
          <div className="navbar-left-group">
            <div className="navbar-logo">
              <Link to="/" onClick={() => handleLinkClick('/')}>
                <img 
                  src={`${import.meta.env.BASE_URL}images/Logo fun.webp`} 
                  alt="Fundación Te Apoyamos" 
                />
              </Link>
            </div>

            <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
              <Link to="/quienes-somos" onClick={() => handleLinkClick('/quienes-somos')}>Quiénes somos</Link>
              
              <div 
                className={`dropdown ${dropdownOpen ? 'open' : ''}`}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link 
                  to="/areas-de-apoyo" 
                  className="dropdown-toggle" 
                  onClick={() => handleLinkClick('/areas-de-apoyo')}
                >
                  Áreas de apoyo <span className="dropdown-arrow">▾</span>
                </Link>

                <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                  <Link to="/areas-de-apoyo/salud" onClick={() => handleLinkClick('/areas-de-apoyo/salud')}>Salud</Link>
                  <Link to="/areas-de-apoyo/social" onClick={() => handleLinkClick('/areas-de-apoyo/social')}>Social</Link>
                  <Link to="/areas-de-apoyo/educacion" onClick={() => handleLinkClick('/areas-de-apoyo/educacion')}>Educación</Link>
                  <Link to="/areas-de-apoyo/capacitacion" onClick={() => handleLinkClick('/areas-de-apoyo/capacitacion')}>Capacitación</Link>  {/* 🔥 NUEVO */}
                </div>
              </div>

              <Link to="/casos" onClick={() => handleLinkClick('/casos')}>Casos</Link>
            </nav>
          </div>

          <div className="navbar-right-actions">
            <Link to="/dona" className="btn-postula" onClick={() => handleLinkClick('/dona')}>Dona aquí</Link>

            <button 
              className={`hamburger ${menuOpen ? 'active' : ''}`} 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

        </div>
      </header>
    </>
  );
}