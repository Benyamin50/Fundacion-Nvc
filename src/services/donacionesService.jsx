// src/services/donacionesService.js
import { API_ENDPOINTS } from '../config/api';

export const donacionesService = {
  async enviar(datos) {
    try {
      const response = await fetch(API_ENDPOINTS.DONACIONES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: datos.nombre,
          email: datos.email,
          telefono: datos.telefono,
          edad: parseInt(datos.edad),
          direccion: datos.direccion,
          pais: datos.pais,
          tipoAporte: datos.tipoAporte,
          mensaje: datos.mensaje || ''
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al guardar los datos');
      }

      return result;
    } catch (error) {
      console.error('❌ Error en donacionesService:', error);
      throw error;
    }
  },

  async obtenerTodas() {
    try {
      const response = await fetch(API_ENDPOINTS.DONACIONES);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al obtener donaciones');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error al obtener donaciones:', error);
      throw error;
    }
  }
};