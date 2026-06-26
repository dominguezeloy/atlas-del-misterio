import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DestinoForm from '../components/Destino/DestinoForm';
import ResultadoDestino from '../components/Destino/ResultadoDestino';

/**
 * DestinoPage - Página principal de la Calculadora del Destino
 * 
 * Renderiza:
 * - Formulario inicial
 * - Resultado con countdown (tras enviar el formulario)
 * - Botón para volver al formulario
 * - Botón para volver al Atlas
 */
export default function DestinoPage() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState('formulario'); // 'formulario' | 'resultado'
  const [prediccionActual, setPrediccionActual] = useState(null);

  const handleResultado = (prediccion) => {
    setPrediccionActual(prediccion);
    setPaso('resultado');
  };

  const handleReitentar = () => {
    setPrediccionActual(null);
    setPaso('formulario');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black pt-20 pb-12 px-4">
      {/* Botón Volver al Atlas */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-start">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors duration-300 px-4 py-2 rounded border border-gray-600 hover:border-yellow-500"
          title="Volver al Atlas del Misterio"
        >
          <span className="text-xl">←</span>
          <span>Volver al Atlas</span>
        </button>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-yellow-500 mb-4 uppercase tracking-widest">
          ☠ Calculadora del Destino
        </h1>
        
        {/* Línea decorativa */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent mb-6 opacity-50"></div>

        {/* Subtítulo - Descargo de responsabilidad */}
        <p className="text-center text-gray-400 text-sm md:text-base leading-relaxed">
          Esta herramienta es <span className="text-yellow-500 font-semibold">únicamente humorística</span>. 
          No pretende realizar predicciones reales ni tiene validez alguna. 
          Es solo un juego para entretenerte.
        </p>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto">
        {paso === 'formulario' && (
          <DestinoForm onResultado={handleResultado} />
        )}

        {paso === 'resultado' && prediccionActual && (
          <ResultadoDestino
            prediccion={prediccionActual}
            onReitentar={handleReitentar}
          />
        )}
      </div>
    </div>
  );
}
