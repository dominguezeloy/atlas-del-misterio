import React, { useState, useEffect } from 'react';

/**
 * Componente Countdown - Muestra una cuenta atrás en tiempo real hasta una fecha objetivo.
 * 
 * Props:
 * - fechaDestino (string ISO 8601): fecha objetivo, ej: "2085-06-26T14:30:45Z"
 * - onCountdownEnd (function, opcional): callback cuando la fecha se alcanza
 */
export default function Countdown({ fechaDestino, onCountdownEnd }) {
  const [tiempoRestante, setTiempoRestante] = useState({
    años: 0,
    meses: 0,
    días: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  useEffect(() => {
    const calcularTiempoRestante = () => {
      const ahora = new Date();
      const destino = new Date(fechaDestino);
      let diferencia = destino - ahora;

      if (diferencia <= 0) {
        setTiempoRestante({
          años: 0,
          meses: 0,
          días: 0,
          horas: 0,
          minutos: 0,
          segundos: 0,
        });
        if (onCountdownEnd) onCountdownEnd();
        return;
      }

      // Calcular cada unidad
      let tempDiferencia = diferencia;

      // Años (aproximado: 365.25 días)
      const segundosPorAño = 365.25 * 24 * 60 * 60 * 1000;
      const años = Math.floor(tempDiferencia / segundosPorAño);
      tempDiferencia -= años * segundosPorAño;

      // Meses (aproximado: 30.44 días)
      const segundosPorMes = 30.44 * 24 * 60 * 60 * 1000;
      const meses = Math.floor(tempDiferencia / segundosPorMes);
      tempDiferencia -= meses * segundosPorMes;

      // Días
      const segundosPorDía = 24 * 60 * 60 * 1000;
      const días = Math.floor(tempDiferencia / segundosPorDía);
      tempDiferencia -= días * segundosPorDía;

      // Horas
      const segundosPorHora = 60 * 60 * 1000;
      const horas = Math.floor(tempDiferencia / segundosPorHora);
      tempDiferencia -= horas * segundosPorHora;

      // Minutos
      const segundosPorMinuto = 60 * 1000;
      const minutos = Math.floor(tempDiferencia / segundosPorMinuto);
      tempDiferencia -= minutos * segundosPorMinuto;

      // Segundos
      const segundos = Math.floor(tempDiferencia / 1000);

      setTiempoRestante({
        años,
        meses,
        días,
        horas,
        minutos,
        segundos,
      });
    };

    calcularTiempoRestante();
    const intervalo = setInterval(calcularTiempoRestante, 1000);

    return () => clearInterval(intervalo);
  }, [fechaDestino, onCountdownEnd]);

  const formatoDoble = (num) => String(num).padStart(2, '0');

  return (
    <div className="text-center mt-8 p-6 bg-gradient-to-b from-gray-900 to-black rounded-lg border border-yellow-600 border-opacity-30">
      <p className="text-gray-400 text-sm mb-4 uppercase tracking-wide">Tiempo restante</p>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {/* Años */}
        <div className="flex flex-col items-center">
          <span className="text-2xl md:text-4xl font-bold text-yellow-500 tabular-nums">
            {formatoDoble(tiempoRestante.años)}
          </span>
          <span className="text-xs text-gray-500 mt-1 uppercase">años</span>
        </div>

        {/* Meses */}
        <div className="flex flex-col items-center">
          <span className="text-2xl md:text-4xl font-bold text-yellow-500 tabular-nums">
            {formatoDoble(tiempoRestante.meses)}
          </span>
          <span className="text-xs text-gray-500 mt-1 uppercase">meses</span>
        </div>

        {/* Días */}
        <div className="flex flex-col items-center">
          <span className="text-2xl md:text-4xl font-bold text-yellow-500 tabular-nums">
            {formatoDoble(tiempoRestante.días)}
          </span>
          <span className="text-xs text-gray-500 mt-1 uppercase">días</span>
        </div>

        {/* Horas */}
        <div className="flex flex-col items-center">
          <span className="text-2xl md:text-4xl font-bold text-yellow-500 tabular-nums">
            {formatoDoble(tiempoRestante.horas)}
          </span>
          <span className="text-xs text-gray-500 mt-1 uppercase">horas</span>
        </div>

        {/* Minutos */}
        <div className="flex flex-col items-center">
          <span className="text-2xl md:text-4xl font-bold text-yellow-500 tabular-nums">
            {formatoDoble(tiempoRestante.minutos)}
          </span>
          <span className="text-xs text-gray-500 mt-1 uppercase">minutos</span>
        </div>

        {/* Segundos */}
        <div className="flex flex-col items-center">
          <span className="text-2xl md:text-4xl font-bold text-yellow-500 tabular-nums">
            {formatoDoble(tiempoRestante.segundos)}
          </span>
          <span className="text-xs text-gray-500 mt-1 uppercase">segundos</span>
        </div>
      </div>
    </div>
  );
}
