import { useState } from 'react';
import PanelProceso from './PanelProceso';
import Comprobante from './Comprobante';
import { formateador } from '../lib/formateador';
import { CalculadoraIESS } from '../lib/procesos';

const calculadora = new CalculadoraIESS();

export default function CalculosIESS() {
  const [sueldo, setSueldo] = useState('');
  const [incluirFondos, setIncluirFondos] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const calcular = (evento) => {
    evento.preventDefault();

    try {
      const datos = calculadora.calcular(sueldo, incluirFondos);
      setError('');
      setResultado(datos);
    } catch (mensaje) {
      setResultado(null);
      setError(mensaje.message);
    }
  };

  return (
    <PanelProceso
      formulario={
        <form className="tarjeta" onSubmit={calcular}>
          <h2>Cálculos IESS</h2>
          <p className="descripcion">
            Estima el aporte del trabajador, el porcentaje patronal y el monto real que queda disponible al final del mes.
          </p>

          <div className="campo">
            <label className="etiqueta" htmlFor="iess-sueldo">Sueldo mensual (USD)</label>
            <input
              id="iess-sueldo"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="1"
              placeholder="Ej.: 800.00"
              value={sueldo}
              onChange={(evento) => setSueldo(evento.target.value)}
            />
          </div>

          <label className="casilla">
            <input
              type="checkbox"
              checked={incluirFondos}
              onChange={(evento) => setIncluirFondos(evento.target.checked)}
            />
            Considerar fondos de reserva mensualizados (8,33 %)
          </label>

          <button type="submit" className="boton-principal">Generar rol de pagos</button>
          <p className="nota">
            Tarifas referenciales: aporte personal 9,45 %, aporte patronal 12,15 % y fondos de reserva 8,33 %.
          </p>
        </form>
      }
      comprobante={
        <Comprobante
          cabecera="Comprobante · Rol de pagos mensual"
          error={error}
          mostrarVacio={!error && !resultado}
          vacioTitulo="Sin resultados"
          vacioTexto="Ingresa el sueldo mensual y genera el rol de pagos."
        >
          {resultado && (
            <>
              <p className="ticket-valor">{formateador.formatearMoneda(resultado.liquidoRecibir)}</p>
              <span className="insignia insignia-acento">Líquido a recibir</span>

              <div className="divisor" />
              <div className="fila">
                <span>Sueldo mensual</span>
                <span>{formateador.formatearMoneda(resultado.sueldoMensual)}</span>
              </div>
              <div className="fila resta">
                <span>(−) Aporte personal IESS · 9,45 %</span>
                <span>{formateador.formatearMoneda(resultado.aportePersonal)}</span>
              </div>
              {resultado.fondosReserva > 0 && (
                <div className="fila suma">
                  <span>(+) Fondos de reserva · 8,33 %</span>
                  <span>{formateador.formatearMoneda(resultado.fondosReserva)}</span>
                </div>
              )}
              <div className="fila total">
                <span>Líquido a recibir</span>
                <span>{formateador.formatearMoneda(resultado.liquidoRecibir)}</span>
              </div>

              <div className="divisor" />
              <p className="ticket-subtitulo">Visión del empleador</p>
              <div className="fila">
                <span>Aporte patronal · 12,15 %</span>
                <span>{formateador.formatearMoneda(resultado.aportePatronal)}</span>
              </div>
              <div className="fila total">
                <span>Costo total mensual</span>
                <span>{formateador.formatearMoneda(resultado.costoEmpleador)}</span>
              </div>
            </>
          )}
        </Comprobante>
      }
    />
  );
}
