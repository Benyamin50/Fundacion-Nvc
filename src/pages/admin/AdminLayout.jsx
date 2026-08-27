import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    closeMenu();
    if (window.confirm('¿Cerrar sesión?')) {
      // 🔥 ELIMINAR TODO, INCLUYENDO EL TOKEN
      localStorage.removeItem('token');
      localStorage.removeItem('admin_logged');
      localStorage.removeItem('admin_email');
      localStorage.removeItem('admin_rol');
      navigate('/');
    }
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/areas', icon: '📂', label: 'Áreas de apoyo' },
    { path: '/admin/casos', icon: '📋', label: 'Casos' },
    { path: '/admin/registros', icon: '📝', label: 'Registro de personas' },
  ];

  return (
    <div className="admin-layout">
      <header className="admin-mobile-header">
        <div className="admin-mobile-logo">
          <img
            src={`${import.meta.env.BASE_URL}images/Logo fun.webp`}
            alt="Fundación NVC"
            className="admin-sidebar-logo-img"
          />
          <span>Administración</span>
        </div>
        <button
          className="admin-hamburger-btn"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </header>

      <div
        className={`admin-sidebar-overlay ${isMenuOpen ? 'open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <img
            src={`${import.meta.env.BASE_URL}images/Logo fun.webp`}
            alt="Fundación NVC"
            className="admin-sidebar-logo-img"
          />
          <span>Administración</span>
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={`admin-sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-sidebar-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}