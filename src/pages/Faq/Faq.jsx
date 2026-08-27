import { useState, useMemo } from 'react';
import { faqData } from '../../data/faq';
import './Faq.css';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('Todas');

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filtrado por categoría
  const filteredFaq = useMemo(() => {
    if (activeTab === 'Todas') return faqData;
    return faqData.filter(item => 
      item.pregunta.toLowerCase().includes(activeTab.toLowerCase()) ||
      item.respuesta.toLowerCase().includes(activeTab.toLowerCase())
    );
  }, [activeTab]);

  // Contar preguntas por categoría
  const getCategoryCount = (category) => {
    if (category === 'Todas') return faqData.length;
    return faqData.filter(item => 
      item.pregunta.toLowerCase().includes(category.toLowerCase()) ||
      item.respuesta.toLowerCase().includes(category.toLowerCase())
    ).length;
  };

  // Configuración de categorías SIN EMOJIS
  const categories = [
    { id: 'Todas', label: 'Todas' },
    { id: 'Postulación', label: 'Postulación' },
    { id: 'Requisitos', label: 'Requisitos' },
    { id: 'Ayudas', label: 'Ayudas' },
  ];

  return (
   <main className="faq-page page-transition">
      <section className="faq-hero">
        <div className="faq-container">
          <span className="faq-badge">Centro de Ayuda</span>
          <h1>Preguntas <span className="highlight">Frecuentes</span></h1>
          <p>Selecciona una categoría para encontrar respuestas rápidas y claras</p>

          {/* ===== CATEGORÍAS MEJORADAS ===== */}
          <div className="faq-categories-wrapper">
            <span className="faq-categories-badge">Explora por tema</span>
            
            <div className="faq-categories-grid">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`faq-category-card ${activeTab === cat.id ? 'active' : ''}`}
                  onClick={() => { setActiveTab(cat.id); setOpenIndex(null); }}
                >
                  <span className="faq-category-name">{cat.label}</span>
                  <span className="faq-category-count">{getCategoryCount(cat.id)} preguntas</span>
                  <span className="check-mark">✓</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="faq-content">
        <div className="faq-container">
          <div className="faq-list">
            {filteredFaq.length > 0 ? (
              filteredFaq.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={item.id} className={`faq-item ${isOpen ? 'active' : ''}`}>
                    <button className="faq-question" onClick={() => toggleFaq(index)}>
                      <span>
                        <span className="q-number">{(index + 1).toString().padStart(2, '0')}</span>
                        {item.pregunta}
                      </span>
                      <span className="faq-icon-wrap">
                        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                      </span>
                    </button>
                    <div className={`faq-answer-wrapper ${isOpen ? 'open' : ''}`}>
                      <div className="faq-answer">
                        <p>{item.respuesta}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="faq-no-results">
                <p>No hay preguntas en esta categoría por el momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}