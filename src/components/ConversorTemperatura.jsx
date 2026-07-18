import { useState } from 'react';
import PanelProceso from './PanelProceso';
import Comprobante from './Comprobante';
import { formateador } from '../lib/formateador';
import { ConversorTemperatura as ConversorTemperaturaBase } from '../lib/procesos';

const UNIDADES = [
  { id: 'C', nombre: 'Celsius (°C)' },
  { id: 'F', nombre: 'Fahrenheit (°F)' },
  { id: 'K', nombre: 'Kelvin (K)' },
];

const conversor = new ConversorTemperaturaBase();

export default function ConversorTemperatura() {
  const [valor, setValor] = useState('');
  const [unidad, setUnidad] = useState('C');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const convertir = (evento) => {
    evento.preventDefault();

    try {
      const datos = conversor.convertir(valor, unidad);
      setError('');
      setResultado(datos);
    } catch (mensaje) {
      setResultado(null);
      setError(mensaje.message);
    }
  };

  const filas = resultado
    ? [
        { id: 'C', etiqueta: 'Celsius', texto: `${formateador.formatearNumero(resultado.c)} °C` },
        { id: 'F', etiqueta: 'Fahrenheit', texto: `${formateador.formatearNumero(resultado.f)} °F` },
        { id: 'K', etiqueta: 'Kelvin', texto: `${formateador.formatearNumero(resultado.k)} K` },
      ]
    : [];

  return (
    <PanelProceso
      formulario={
        <form className="tarjeta" onSubmit={convertir}>
          <h2>Conversor de temperatura</h2>
          <p className="descripcion">
            Convierte el valor de temperatura entre Celsius, Fahrenheit y Kelvin en un solo paso.
          </p>

          <div className="campo">
            <label className="etiqueta" htmlFor="temp-valor">Valor de temperatura</label>
            <input
              id="temp-valor"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="Ej.: 25"
              value={valor}
              onChange={(evento) => setValor(evento.target.value)}
            />
          </div>

          <div className="campo">
            <label className="etiqueta" htmlFor="temp-unidad">Unidad de origen</label>
            <select id="temp-unidad" value={unidad} onChange={(evento) => setUnidad(evento.target.value)}>
              {UNIDADES.map((unidadActual) => (
                <option key={unidadActual.id} value={unidadActual.id}>{unidadActual.nombre}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="boton-principal">Convertir</button>
          <p className="nota">Fórmulas de referencia: °F = °C × 9/5 + 32 · K = °C + 273,15.</p>
        </form>
      }
      comprobante={
        <Comprobante
          cabecera="Comprobante · Equivalencias"
          error={error}
          mostrarVacio={!error && !resultado}
          vacioTitulo="Sin resultados"
          vacioTexto="Escribe un valor, elige la unidad y presiona convertir."
        >
          {resultado && (
            <>
              {filas.map((fila) => (
                <div key={fila.id} className={`fila-temp${fila.id === resultado.origen ? ' origen' : ''}`}>
                  <span>
                    {fila.etiqueta}
                    {fila.id === resultado.origen && <em className="marca-origen">origen</em>}
                  </span>
                  <strong>{fila.texto}</strong>
                </div>
              ))}
              <div className="divisor" />
              <div className="fila">
                <span>Cero absoluto</span>
                <span>−273,15 °C · −459,67 °F · 0 K</span>
              </div>
            </>
          )}
        </Comprobante>
      }
    />
  );
}
