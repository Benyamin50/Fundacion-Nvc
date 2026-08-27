// src/services/casosService.js
import cacheService from './cacheService';
import { publicService } from './publicService';

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

export const casosService = {
  // Obtener todos los casos
  async getAll() {
    const response = await fetch(`${API_URL}/api/admin/casos`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener casos');
    return response.json();
  },

  // Crear nuevo caso
  async create(data) {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('subtitulo', data.subtitulo || '');
    formData.append('descripcion', data.descripcion);
    formData.append('destacado', data.destacado || false);
    if (data.imagen) formData.append('imagen', data.imagen);

    const response = await fetch(`${API_URL}/api/admin/casos`, {
      method: 'POST',
      headers: getHeadersMultipart(),
      body: formData
    });
    if (!response.ok) throw new Error('Error al crear caso');
    const result = await response.json();
    
    if (result.data) {
      cacheService.addCaso(result.data);
    }
    
    return result;
  },

  // Actualizar caso
  async update(id, data) {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('subtitulo', data.subtitulo || '');
    formData.append('descripcion', data.descripcion);
    formData.append('destacado', data.destacado || false);
    if (data.imagen) formData.append('imagen', data.imagen);

    const response = await fetch(`${API_URL}/api/admin/casos/${id}`, {
      method: 'PUT',
      headers: getHeadersMultipart(),
      body: formData
    });
    if (!response.ok) throw new Error('Error al actualizar caso');
    const result = await response.json();
    
    if (result.data) {
      cacheService.updateCaso(id, result.data);
    }
    
    return result;
  },

  // Eliminar caso
  async delete(id) {
    const response = await fetch(`${API_URL}/api/admin/casos/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar caso');
    
    cacheService.removeCaso(id);
    
    return response.json();
  },

  // Quitar destacado de todos los casos
  async quitarDestacadoDeTodos() {
    const response = await fetch(`${API_URL}/api/admin/casos/quitar-destacado`, {
      method: 'PUT',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al quitar destacados');
    
    // 🔥 REFRESCAR CACHÉ DE CASOS
    try {
      await publicService.refreshCasos();
    } catch (error) {
      console.warn('⚠️ No se pudo refrescar el caché automáticamente');
    }
    
    return response.json();
  }
};