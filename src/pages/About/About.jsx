import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  // Colaboradores y Voluntarios
  const colaboradores = [
    "Nain Calderon",
    "Anthony Canelon",
    "Margarita Román",
    "Elismary Peréz",
    "Gladys Rada",
    "Edoar Peréz",
    "Jeremy Montilla",
    "Keila Parraga",
    "Mary Brito",
    "Raúl Mendez"
  ];

  return (
    <div className="about-full-page">
      <main className="about-page">
        
        {/* HERO */}
        <section className="about-hero">
          <div className="about-container">
            <span className="about-badge">Nuestra Identidad</span>
            <h1>Quiénes Somos</h1>
            <p>Conoce nuestra historia, misión y los valores que impulsan nuestro compromiso con la sociedad.</p>
          </div>
        </section>

        {/* CONTENIDO PRINCIPAL (MISIÓN Y VISIÓN) */}
        <section className="about-content">
          <div className="about-container">
            <div className="about-grid">
              
              <div className="about-card">
                <span className="about-card-tag">Propósito</span>
                <h2>Nuestra Misión</h2>
                <p>Ser un puente de esperanza que levante la dignidad de quienes más lo necesitan, brindando apoyo integral y espiritual, reflejando el amor de Cristo en cada acción.</p>
              </div>
              
              <div className="about-card">
                <span className="about-card-tag">Futuro</span>
                <h2>Nuestra Visión</h2>
                <p>Ser una fundación que toma acción y empática, reconocida por restaurar vidas y llevar un mensaje firme de fe y bienestar a cada rincón con necesidad.</p>
              </div>

            </div>
          </div>
        </section>

        {/* FUNDADOR */}
        <section className="about-founder-section">
          <div className="about-container">
            <div className="about-founder-box">
              <div className="about-founder-content">
                <span className="about-card-tag">Fundador</span>
                <h2>Raúl Calderón</h2>
                {/* NUEVA FRASE DE RELLENO AQUÍ */}
                <p className="about-founder-quote">
                  "Creemos firmemente en el poder transformador del amor y la solidaridad. Nuestro mayor propósito es ser un instrumento de cambio, acompañando a cada familia y demostrando que nunca están solos en los momentos de dificultad."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE COLABORADORES Y VOLUNTARIOS */}
        <section className="about-team-section">
          <div className="about-container">
            <div className="team-header">
              <span className="about-card-tag">Equipo</span>
              <h2>Colaboradores y Voluntarios</h2>
              <p>Personas comprometidas con una misma causa, unidas por la fe y la esperanza.</p>
            </div>
            
            <div className="team-grid">
              {colaboradores.map((nombre, index) => (
                <div key={index} className="team-card">
                  <h3>{nombre}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LLAMADO A LA ACCIÓN */}
        <section className="about-cta-section">
          <div className="about-container">
            <div className="about-cta-box">
              <h2>¿Quieres ser parte del cambio?</h2>
              <p>El trabajo que realizamos es posible gracias al apoyo de personas comprometidas con un futuro mejor. Toda contribución, grande o pequeña, suma a nuestra causa.</p>
              <div className="about-cta-buttons">
                <Link to="/dona" className="btn-about-primary">Donar ahora</Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}