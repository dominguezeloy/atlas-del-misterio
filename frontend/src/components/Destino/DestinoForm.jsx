import React, { useState, useEffect } from 'react';
import { obtenerPrediccion } from '../../services/DestinoService';

/**
 * Componente DestinoForm - Formulario de la Calculadora del Destino
 * 
 * Props:
 * - onResultado (function): callback cuando se obtiene una predicción
 */
export default function DestinoForm({ onResultado }) {
  const [formData, setFormData] = useState({
    nick: localStorage.getItem('atlas_destino_nick') || '',
    anioNacimiento: localStorage.getItem('atlas_destino_anio') || '',
    sexo: '',
    signoZodiaco: '',
    paranormal: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signos = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación: año nacimiento obligatorio
    if (!formData.anioNacimiento) {
      setError('El año de nacimiento es obligatorio.');
      return;
    }

    const anio = parseInt(formData.anioNacimiento, 10);
    if (anio < 1900 || anio > 2026) {
      setError('El año de nacimiento debe estar entre 1900 y 2026.');
      return;
    }

    setLoading(true);
    try {
      // Guardar en localStorage para UX mejorada
      if (formData.nick) {
        localStorage.setItem('atlas_destino_nick', formData.nick);
      }
      localStorage.setItem('atlas_destino_anio', formData.anioNacimiento);

      // Obtener predicción del backend
      const prediccion = await obtenerPrediccion(anio);
      onResultado(prediccion);
    } catch (err) {
      setError('Error al calcular tu destino. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-8 bg-gradient-to-b from-gray-950 to-black rounded-lg border border-yellow-600 border-opacity-30 backdrop-blur-sm"
    >
      {/* Nick (Opcional) */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
          Nick o Nombre (Opcional)
        </label>
        <input
          type="text"
          name="nick"
          value={formData.nick}
          onChange={handleChange}
          placeholder="p.ej., MisticoX, AmasDelMisterio..."
          maxLength="50"
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 placeholder-gray-600 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition"
        />
      </div>

      {/* Año de Nacimiento (Obligatorio) */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-100 mb-2 uppercase tracking-wide">
          Año de Nacimiento <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="anioNacimiento"
          value={formData.anioNacimiento}
          onChange={handleChange}
          placeholder="p.ej., 1995"
          min="1900"
          max="2026"
          required
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 placeholder-gray-600 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition"
        />
      </div>

      {/* Sexo (Opcional) */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
          Sexo (Opcional)
        </label>
        <select
          name="sexo"
          value={formData.sexo}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition"
        >
          <option value="">— Selecciona —</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
          <option value="prefiero_no">Prefiero no decir</option>
        </select>
      </div>

      {/* Signo Zodiacal (Opcional) */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
          Signo Zodiacal (Opcional)
        </label>
        <select
          name="signoZodiaco"
          value={formData.signoZodiaco}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition"
        >
          <option value="">— Selecciona —</option>
          {signos.map((signo) => (
            <option key={signo} value={signo}>
              {signo}
            </option>
          ))}
        </select>
      </div>

      {/* ¿Crees en lo paranormal? (Obligatorio) */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-100 mb-3 uppercase tracking-wide">
          ¿Crees en lo paranormal? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {['Si', 'No', 'A veces'].map((opcion) => (
            <label key={opcion} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paranormal"
                value={opcion.toLowerCase()}
                checked={formData.paranormal === opcion.toLowerCase()}
                onChange={handleChange}
                className="w-4 h-4 accent-yellow-600"
              />
              <span className="text-gray-300">{opcion}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="mb-6 p-3 bg-red-900 bg-opacity-30 border border-red-600 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Botón Enviar */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-gray-900 font-bold uppercase tracking-wide rounded transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        {loading ? 'Calculando...' : '☠ Calcular mi destino'}
      </button>
    </form>
  );
}
