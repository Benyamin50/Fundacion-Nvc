import { useState } from 'react';
import './Donations.css';

export default function Donations() {
  const numeroWhatsApp = "584125309882";

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    edad: '',
    direccion: '',
    pais: 'Venezuela',
    tipoAporte: 'Aporte económico',
    mensaje: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔥 VALIDACIONES
  const validarEmail = (email) => {
    const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return patron.test(email);
  };

  const validarTelefono = (telefono) => {
    const limpio = telefono.replace(/[^0-9+]/g, '');
    return limpio.length >= 7 && limpio.length <= 20;
  };

  const validarNombre = (nombre) => {
    return nombre.trim().length >= 2;
  };

  const validarEdad = (edad) => {
    const num = parseInt(edad);
    return !isNaN(num) && num >= 1 && num <= 120;
  };

  const validarDireccion = (direccion) => {
    return direccion.trim().length >= 3;
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!validarNombre(formData.nombre)) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!validarEmail(formData.email)) {
      nuevosErrores.email = 'Ingresa un correo electrónico válido';
    }

    if (!validarTelefono(formData.telefono)) {
      nuevosErrores.telefono = 'Ingresa un número de teléfono válido (mínimo 7 dígitos)';
    }

    if (!validarEdad(formData.edad)) {
      nuevosErrores.edad = 'Ingresa una edad válida (1-120 años)';
    }

    if (!validarDireccion(formData.direccion)) {
      nuevosErrores.direccion = 'Ingresa una dirección válida';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar errores del campo al escribir
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      edad: '',
      direccion: '',
      pais: 'Venezuela',
      tipoAporte: 'Aporte económico',
      mensaje: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔥 VALIDAR ANTES DE ENVIAR
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('https://igrafic360.net/api-fundacion/api/donaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          email: formData.email.toLowerCase().trim(),
          telefono: formData.telefono.replace(/[^0-9+]/g, ''),
          edad: parseInt(formData.edad),
          direccion: formData.direccion.trim(),
          pais: formData.pais,
          tipoAporte: formData.tipoAporte,
          mensaje: formData.mensaje ? formData.mensaje.trim() : ''
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al guardar los datos');
      }

      setSuccess(true);
      const datosActuales = { ...formData };

      setTimeout(() => {
        const textoMensaje = 
          `Estimado equipo de la Fundación NVC,\n\n` +
          `Me pongo en contacto con ustedes con el propósito de formalizar una donación y colaborar con su causa.\n\n` +
          `*DATOS DE CONTACTO*\n` +
          `• Nombre y Apellido: ${datosActuales.nombre}\n` +
          `• Edad: ${datosActuales.edad} años\n` +
          `• Correo electrónico: ${datosActuales.email}\n` +
          `• Teléfono de contacto: ${datosActuales.telefono}\n` +
          `• Dirección de residencia: ${datosActuales.direccion}\n` +
          `• País: ${datosActuales.pais}\n\n` +
          `*DETALLES DEL APORTE*\n` +
          `• Tipo de aporte: ${datosActuales.tipoAporte}\n` +
          `${datosActuales.mensaje ? '• Observaciones / Nota: ' + datosActuales.mensaje + '\n\n' : '\n'}` +
          `Quedo atento(a) a sus indicaciones para coordinar la entrega o el proceso correspondiente. ¡Muchas gracias!`;

        const mensajeCodificado = encodeURIComponent(textoMensaje);
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
        
        window.open(urlWhatsApp, '_blank');
        resetForm();
      }, 1200);

      setTimeout(() => {
        setSuccess(false);
      }, 5000);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Ocurrió un error al procesar tu donación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donations-full-page page-transition">
      <main className="donations-page">
        
        <section className="donations-hero">
          <div className="donations-container">
            <span className="donations-badge">Súmate a la causa</span>
            <h1>Haz tu Donación</h1>
            <p>Tu aporte nos permite seguir transformando vidas. Completa el formulario y nos contactaremos directamente por WhatsApp para coordinar los detalles de forma segura.</p>
          </div>
        </section>

        <section className="donations-content">
          <div className="donations-container">
            <div className="donations-grid">
              
              <div className="donations-info">
                <h2>Cada aporte cuenta</h2>
                <p>Las donaciones nos permiten sostener nuestros programas de salud, educación y desarrollo social a lo largo del tiempo.</p>
                <p><strong>Seguridad y transparencia:</strong> Al comunicarnos por WhatsApp, garantizamos que tratarás con un miembro oficial de nuestro equipo, brindándote toda la información bancaria o logística necesaria de manera privada y segura.</p>
              </div>

              <div className="donations-form-box">
                
                {error && (
                  <div className="donations-alert donations-error">
                    <div className="alert-icon">⚠️</div>
                    <div className="alert-content">
                      <strong>Atención</strong>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="donations-alert donations-success">
                    <div className="alert-icon">✅</div>
                    <div className="alert-content">
                      <strong>¡Registro exitoso!</strong>
                      <span>Abriendo WhatsApp para coordinar tu aporte...</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="donations-form">
                  
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre completo *</label>
                    <input 
                      type="text" 
                      id="nombre" 
                      name="nombre" 
                      required 
                      value={formData.nombre} 
                      onChange={handleChange}
                      placeholder="Ej: Juan Pérez"
                      disabled={loading}
                      className={errors.nombre ? 'input-error' : ''}
                    />
                    {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Correo electrónico *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        value={formData.email} 
                        onChange={handleChange}
                        placeholder="ejemplo@correo.com"
                        disabled={loading}
                        className={errors.email ? 'input-error' : ''}
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="telefono">Número telefónico *</label>
                      <input 
                        type="tel" 
                        id="telefono" 
                        name="telefono" 
                        required 
                        value={formData.telefono} 
                        onChange={handleChange}
                        placeholder="Ej: +58 412 1234567"
                        disabled={loading}
                        className={errors.telefono ? 'input-error' : ''}
                      />
                      {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="edad">Edad *</label>
                      <input 
                        type="number" 
                        id="edad" 
                        name="edad" 
                        required 
                        min="1"
                        max="120"
                        value={formData.edad} 
                        onChange={handleChange}
                        placeholder="Ej: 25"
                        disabled={loading}
                        className={errors.edad ? 'input-error' : ''}
                      />
                      {errors.edad && <span className="error-message">{errors.edad}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="pais">País de residencia *</label>
                      <select 
                        id="pais" 
                        name="pais" 
                        required 
                        value={formData.pais} 
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="Venezuela">Venezuela</option>
                        <option value="Chile">Chile</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Estados Unidos">Estados Unidos</option>
                        <option value="España">España</option>
                        <option value="Otro">Otro país</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="direccion">Dirección de residencia *</label>
                    <input 
                      type="text" 
                      id="direccion" 
                      name="direccion" 
                      required 
                      value={formData.direccion} 
                      onChange={handleChange}
                      placeholder="Ciudad, Sector o Calle"
                      disabled={loading}
                      className={errors.direccion ? 'input-error' : ''}
                    />
                    {errors.direccion && <span className="error-message">{errors.direccion}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="tipoAporte">Tipo de aporte *</label>
                    <select 
                      id="tipoAporte" 
                      name="tipoAporte" 
                      required 
                      value={formData.tipoAporte} 
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="Aporte económico">Aporte económico</option>
                      <option value="Donación de insumos médicos">Insumos médicos</option>
                      <option value="Donación de útiles escolares">Útiles escolares</option>
                      <option value="Voluntariado corporativo">Voluntariado / Servicios</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mensaje">Mensaje adicional (Opcional)</label>
                    <textarea 
                      id="mensaje" 
                      name="mensaje" 
                      rows="3" 
                      value={formData.mensaje} 
                      onChange={handleChange}
                      placeholder="¿Tienes alguna duda o solicitud específica?"
                      disabled={loading}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className={`btn-donations-submit ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : 'Coordinar por WhatsApp'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}