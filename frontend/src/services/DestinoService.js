import api from './api';

/**
 * Obtiene una predicción aleatoria de la Calculadora del Destino.
 * 
 * @param {number} anioNacimiento - Año de nacimiento del usuario (obligatorio, 1900-2026)
 * @returns {Promise<{id: number, descripcion: string, fecha_destino: string}>}
 */
export const obtenerPrediccion = async (anioNacimiento) => {
  try {
    const { data } = await api.get('/predicciones/random/', {
      params: { anio_nacimiento: anioNacimiento },
    });
    return data;
  } catch (error) {
    console.error('Error al obtener predicción:', error);
    throw error;
  }
};
