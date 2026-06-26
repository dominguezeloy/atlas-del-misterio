import React from 'react';
import { useNavigate } from 'react-router-dom';
import Countdown from '../Countdown';

/**
 * Componente ResultadoDestino - Muestra la predicción y el countdown
 * 
 * Props:
 * - prediccion (object): {id, descripcion, fecha_destino}
 * - onReitentar (function): callback para volver al formulario
 */
export default function ResultadoDestino({ prediccion, onReitentar }) {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      {/* Card de Predicción */}
      <div className="bg-gradient-to-b from-gray-950 to-black rounded-lg border border-yellow-600 border-opacity-40 p-8 shadow-2xl backdrop-blur-sm">
        {/* Título */}
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-500 text-center mb-2 uppercase tracking-widest">
          Tu Predicción
        </h2>
        
        {/* Línea decorativa */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent mb-8 opacity-50"></div>

        {/* Descripción de la predicción */}
        <div className="mb-8 p-6 bg-black bg-opacity-50 rounded border border-yellow-600 border-opacity-20">
          <p className="text-xl md:text-2xl text-gray-100 text-center leading-relaxed font-serif italic">
            {prediccion.descripcion}
          </p>
        </div>

        {/* Countdown */}
        <Countdown fechaDestino={prediccion.fecha_destino} />

        {/* Botones de Acción */}
        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={onReitentar}
            className="w-full px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-yellow-500 font-bold uppercase tracking-wide rounded border border-yellow-600 border-opacity-30 hover:border-opacity-60 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            🔄 Volver a Intentarlo
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-gray-300 hover:text-yellow-500 font-semibold uppercase tracking-wide rounded border border-gray-600 hover:border-yellow-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            ← Volver al Atlas
          </button>
        </div>
      </div>

      {/* Nota de descargo */}
      <div className="mt-6 text-center text-gray-500 text-xs italic">
        Esta predicción es únicamente para entretenimiento.
      </div>
    </div>
  );
}
