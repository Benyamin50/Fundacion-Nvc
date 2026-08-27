// src/services/cacheService.js

class CacheService {
  constructor() {
    this.cache = {
      areas: null,
      casos: null,
      lastFetch: {
        areas: null,
        casos: null
      }
    };
    this.ttl = 60000; // 60 segundos
  }

  // ==========================================
  // AREAS
  // ==========================================

  getAreas() {
    return this.cache.areas;
  }

  setAreas(data) {
    this.cache.areas = data;
    this.cache.lastFetch.areas = Date.now();
  }

  addArea(area) {
    if (this.cache.areas) {
      this.cache.areas.push(area);
    }
  }

  updateArea(id, updatedData) {
    if (this.cache.areas) {
      const index = this.cache.areas.findIndex(a => a.id === id);
      if (index !== -1) {
        this.cache.areas[index] = { ...this.cache.areas[index], ...updatedData };
      }
    }
  }

  removeArea(id) {
    if (this.cache.areas) {
      this.cache.areas = this.cache.areas.filter(a => a.id !== id);
    }
  }

  hasAreas() {
    return this.cache.areas !== null && this.cache.areas.length > 0;
  }

  // ==========================================
  // CASOS
  // ==========================================

  getCasos() {
    return this.cache.casos;
  }

  setCasos(data) {
    this.cache.casos = data;
    this.cache.lastFetch.casos = Date.now();
  }

  addCaso(caso) {
    if (this.cache.casos) {
      this.cache.casos.push(caso);
    }
  }

  updateCaso(id, updatedData) {
    if (this.cache.casos) {
      const index = this.cache.casos.findIndex(c => c.id === id);
      if (index !== -1) {
        this.cache.casos[index] = { ...this.cache.casos[index], ...updatedData };
      }
    }
  }

  removeCaso(id) {
    if (this.cache.casos) {
      this.cache.casos = this.cache.casos.filter(c => c.id !== id);
    }
  }

  hasCasos() {
    return this.cache.casos !== null && this.cache.casos.length > 0;
  }

  // ==========================================
  // UTILIDADES
  // ==========================================

  clearAll() {
    this.cache.areas = null;
    this.cache.casos = null;
    this.cache.lastFetch.areas = null;
    this.cache.lastFetch.casos = null;
  }

  isAreasExpired() {
    const last = this.cache.lastFetch.areas;
    return !last || (Date.now() - last) > this.ttl;
  }

  isCasosExpired() {
    const last = this.cache.lastFetch.casos;
    return !last || (Date.now() - last) > this.ttl;
  }

  // ==========================================
  // DEBUG
  // ==========================================

  getStatus() {
    return {
      areas: {
        count: this.cache.areas ? this.cache.areas.length : 0,
        lastFetch: this.cache.lastFetch.areas,
        expired: this.isAreasExpired()
      },
      casos: {
        count: this.cache.casos ? this.cache.casos.length : 0,
        lastFetch: this.cache.lastFetch.casos,
        expired: this.isCasosExpired()
      }
    };
  }
}

export default new CacheService();