import { useState } from 'react';
import PanelProceso from './PanelProceso';
import Comprobante from './Comprobante';
import { CalculadoraIMC } from '../lib/procesos';

const calculadora = new CalculadoraIMC();

export default function CalculoIMC() {
  const [peso, setPeso] = useState('');
  const [estatura, setEstatura] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const calcular = (evento) => {
    evento.preventDefault();

    try {
      const datos = calculadora.calcular(peso, estatura);
      setError('');
      setResultado(datos);
    } catch (mensaje) {
      setResultado(null);
      setError(mensaje.message);
    }
  };

  const posicionMarcador = resultado
    ? calculadora.obtenerPosicionMarcador(resultado.imc)
    : 0;

  return (
    <PanelProceso
      formulario={
        <form className="tarjeta" onSubmit={calcular}>
          <h2>Cálculo de IMC</h2>
          <p className="descripcion">
            Compara tu peso con tu estatura para identificar tu rango corporal con una referencia sencilla.
          </p>

          <div className="campo">
            <label className="etiqueta" htmlFor="imc-peso">Peso (kg)</label>
            <input
              id="imc-peso"
              type="number"
              inputMode="decimal"
              step="0.1"
              min="1"
              placeholder="Ej.: 70.5"
              value={peso}
              onChange={(evento) => setPeso(evento.target.value)}
            />
          </div>

          <div className="campo">
            <label className="etiqueta" htmlFor="imc-estatura">Estatura (cm)</label>
            <input
              id="imc-estatura"
              type="number"
              inputMode="decimal"
              step="0.1"
              min="1"
              placeholder="Ej.: 172"
              value={estatura}
              onChange={(evento) => setEstatura(evento.target.value)}
            />
          </div>

          <button type="submit" className="boton-principal">Calcular IMC</button>
          <p className="nota">Referencia educativa basada en rangos de la OMS; no reemplaza una valoración médica.</p>
        </form>
      }
      comprobante={
        <Comprobante
          cabecera="Comprobante · IMC"
          error={error}
          mostrarVacio={!error && !resultado}
          vacioTitulo="Sin resultados"
          vacioTexto="Escribe tu peso y estatura para obtener el índice corporal."
        >
          {resultado && (
            <>
              <p className="ticket-valor">{resultado.imc.toLocaleString('es-EC', { maximumFractionDigits: 2 })}</p>
              <span
                className="insignia"
                style={{ backgroundColor: `${resultado.categoria.color}1f`, color: resultado.categoria.color }}
              >
                {resultado.categoria.nombre}
              </span>

              <div className="barra-imc" role="img" aria-label={`IMC ${resultado.imc.toFixed(2)}, categoría ${resultado.categoria.nombre}`}>
                <div className="barra-segmentos">
                  <span style={{ width: '24.3%', background: '#2E6FE8' }} />
                  <span style={{ width: '18.6%', background: '#0E8A5F' }} />
                  <span style={{ width: '14.3%', background: '#DFA000' }} />
                  <span style={{ width: '42.8%', background: '#D43D2A' }} />
                </div>
                <span className="barra-marcador" style={{ left: `${posicionMarcador}%` }} />
              </div>

              <div className="divisor" />
              <div className="fila"><span>Bajo peso</span><span>&lt; 18,50</span></div>
              <div className="fila"><span>Peso normal</span><span>18,50 – 24,99</span></div>
              <div className="fila"><span>Sobrepeso</span><span>25,00 – 29,99</span></div>
              <div className="fila"><span>Obesidad</span><span>≥ 30,00</span></div>
            </>
          )}
        </Comprobante>
      }
    />
  );
}
