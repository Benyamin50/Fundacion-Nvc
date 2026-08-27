// src/services/areasService.js
import cacheService from './cacheService';

const API_URL = 'https://igrafic360.net/api-fundacion';

const getToken = () => {
  return localStorage.getItem('token');
};

const getHeaders = () => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getHeadersMultipart = () => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const areasService = {
  // Obtener todas las áreas
  async getAll() {
    const response = await fetch(`${API_URL}/api/admin/areas`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener áreas');
    return response.json();
  },

  // Crear nueva área
  async create(data) {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('subtitulo', data.subtitulo || '');
    formData.append('categoria', data.categoria);
    formData.append('descripcion', data.descripcion);
    if (data.imagen) formData.append('imagen', data.imagen);

    const response = await fetch(`${API_URL}/api/admin/areas`, {
      method: 'POST',
      headers: getHeadersMultipart(),
      body: formData
    });
    if (!response.ok) throw new Error('Error al crear área');
    const result = await response.json();
    
    // 🔥 ACTUALIZAR CACHÉ
    if (result.data) {
      cacheService.addArea(result.data);
    }
    
    return result;
  },

  // Actualizar área
  async update(id, data) {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('subtitulo', data.subtitulo || '');
    formData.append('categoria', data.categoria);
    formData.append('descripcion', data.descripcion);
    if (data.imagen) formData.append('imagen', data.imagen);

    const response = await fetch(`${API_URL}/api/admin/areas/${id}`, {
      method: 'PUT',
      headers: getHeadersMultipart(),
      body: formData
    });
    if (!response.ok) throw new Error('Error al actualizar área');
    const result = await response.json();
    
    // 🔥 ACTUALIZAR CACHÉ
    if (result.data) {
      cacheService.updateArea(id, result.data);
    }
    
    return result;
  },

  // Eliminar área
  async delete(id) {
    const response = await fetch(`${API_URL}/api/admin/areas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar área');
    
    // 🔥 ACTUALIZAR CACHÉ
    cacheService.removeArea(id);
    
    return response.json();
  }
};