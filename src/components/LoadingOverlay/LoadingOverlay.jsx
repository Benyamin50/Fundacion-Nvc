import './LoadingOverlay.css';

// Fíjate que diga "export default" y no solo "export"
export default function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando...</p>
      </div>
    </div>
  );
}