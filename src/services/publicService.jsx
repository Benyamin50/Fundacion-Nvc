// src/services/publicService.js
import cacheService from './cacheService';

const API_URL = 'https://igrafic360.net/api-fundacion';

export const publicService = {
  // ==========================================
  // AREAS - CON CACHÉ
  // ==========================================

  async getAreas(forceRefresh = false) {
    // Si hay caché y no se fuerza refresco, devolver caché
    if (!forceRefresh && cacheService.hasAreas()) {
      return { status: 'success', data: cacheService.getAreas() };
    }

    try {
      const response = await fetch(`${API_URL}/api/public/areas`);
      if (!response.ok) throw new Error('Error al obtener áreas');
      const data = await response.json();
      
      // Guardar en caché
      cacheService.setAreas(data.data || []);
      return data;
    } catch (error) {
      console.error('Error al cargar áreas:', error);
      // Si hay error pero hay caché, devolver caché
      if (cacheService.hasAreas()) {
        return { status: 'success', data: cacheService.getAreas() };
      }
      throw error;
    }
  },

  // ==========================================
  // CASOS - CON CACHÉ
  // ==========================================

  async getCasos(forceRefresh = false) {
    // Si hay caché y no se fuerza refresco, devolver caché
    if (!forceRefresh && cacheService.hasCasos()) {
      return { status: 'success', data: cacheService.getCasos() };
    }

    try {
      const response = await fetch(`${API_URL}/api/public/casos`);
      if (!response.ok) throw new Error('Error al obtener casos');
      const data = await response.json();
      
      // Guardar en caché
      cacheService.setCasos(data.data || []);
      return data;
    } catch (error) {
      console.error('Error al cargar casos:', error);
      // Si hay error pero hay caché, devolver caché
      if (cacheService.hasCasos()) {
        return { status: 'success', data: cacheService.getCasos() };
      }
      throw error;
    }
  },

  // ==========================================
  // REFRESCAR CACHÉ (desde admin)
  // ==========================================

  async refreshAll() {
    const [areas, casos] = await Promise.all([
      this.getAreas(true),
      this.getCasos(true)
    ]);
    return { areas, casos };
  },

  async refreshAreas() {
    return this.getAreas(true);
  },

  async refreshCasos() {
    return this.getCasos(true);
  }
};