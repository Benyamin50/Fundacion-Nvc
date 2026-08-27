import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useLoading } from '../context/LoadingContext'

// Componentes públicos
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'
import SupportAreas from '../pages/SupportAreas/SupportAreas'
import AreaDetail from '../pages/SupportAreas/AreaDetail'
import Cases from '../pages/Cases/Cases'
import Donations from '../pages/Donations/Donations'
import ArticleDetail from '../pages/ArticleDetail/ArticleDetail'

// Admin
import AdminLogin from '../pages/admin/AdminLogin'
import AdminLayout from '../pages/admin/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AreaApoyo from '../pages/admin/views/AreaApoyo'
import CasosAdmin from '../pages/admin/views/CasosAdmin'
import RegistroPersonas from '../pages/admin/views/RegistroPersonas'

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const root = document.getElementById('root');
    if (root) {
      root.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);
  
  return null;
}

// Proteger rutas del admin
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('admin_logged') === 'true';
  if (!isLoggedIn) {
    window.location.href = `${import.meta.env.BASE_URL}admin`;
    return null;
  }
  return children;
}

function LayoutPublico() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { hideLoading } = useLoading();

  useEffect(() => {
    const timer = setTimeout(() => {
      hideLoading();
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname, hideLoading]);

  useEffect(() => {
    const handleLoad = () => {
      hideLoading();
    };
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, [hideLoading]);

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        {/* ===== RUTAS PÚBLICAS ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/quienes-somos" element={<About />} />
        <Route path="/areas-de-apoyo" element={<SupportAreas />} />
        <Route path="/areas-de-apoyo/:slug" element={<AreaDetail />} />
        <Route path="/publicacion/:id" element={<ArticleDetail />} />
        <Route path="/casos" element={<Cases />} />
        <Route path="/dona" element={<Donations />} />

        {/* ===== RUTAS DEL ADMIN ===== */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="areas" element={<AreaApoyo />} />
          <Route path="casos" element={<CasosAdmin />} />
          <Route path="registros" element={<RegistroPersonas />} />
        </Route>

        {/* ===== RUTA 404: SECCIÓN NO ENCONTRADA ===== */}
        <Route path="*" element={
          <div style={{ textAlign: 'center', padding: '140px 20px', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--primary, #155263)', marginBottom: '10px' }}>Sección no encontrada</h1>
            <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '1.1rem' }}>Lo sentimos, la sección que buscas no existe.</p>
            <Link to="/" className="btn-support" style={{ textDecoration: 'none', display: 'inline-block', padding: '12px 25px', backgroundColor: '#155263', color: '#fff', borderRadius: '6px', fontWeight: 'bold' }}>
              Volver al Inicio
            </Link>
          </div>
        } />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function AppRouter() {
  return (
    <Router basename="/fundacionNvc">
      <ScrollToTop />
      <LayoutPublico />
    </Router>
  )
}