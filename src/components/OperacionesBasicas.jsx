import { useMemo, useState } from 'react';
import PanelProceso from './PanelProceso';
import Comprobante from './Comprobante';
import { formateador } from '../lib/formateador';

const OPERACIONES = [
  { simbolo: '+', nombre: 'Suma', calcular: (a, b) => a + b },
  { simbolo: '−', nombre: 'Resta', calcular: (a, b) => a - b },
  { simbolo: '×', nombre: 'Multiplicación', calcular: (a, b) => a * b },
  { simbolo: '÷', nombre: 'División', calcular: (a, b) => a / b },
];

export default function OperacionesBasicas() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [historial, setHistorial] = useState([]);

  const ejecutar = (operacion) => {
    const numA = Number.parseFloat(a);
    const numB = Number.parseFloat(b);

    if (Number.isNaN(numA) || Number.isNaN(numB)) {
      setResultado(null);
      setError('Ingresa los dos números antes de operar.');
      return;
    }

    if (operacion.simbolo === '÷' && numB === 0) {
      setResultado(null);
      setError('No se puede dividir entre cero. Cambia el segundo número y vuelve a intentarlo.');
      return;
    }

    const valor = operacion.calcular(numA, numB);
    const registro = { a: numA, b: numB, simbolo: operacion.simbolo, nombre: operacion.nombre, valor };

    setError('');
    setResultado(registro);
    setHistorial((anterior) => [registro, ...anterior].slice(0, 6));
  };

  const limpiar = () => {
    setA('');
    setB('');
    setResultado(null);
    setError('');
    setHistorial([]);
  };

  const comprobante = useMemo(() => {
    if (error || !resultado) return null;

    return (
      <>
        <p className="ticket-valor">{formateador.formatearNumero(resultado.valor)}</p>
        <div className="divisor" />
        <div className="fila">
          <span>Operación</span>
          <span>{resultado.nombre}</span>
        </div>
        <div className="fila">
          <span>Expresión</span>
          <span>
            {formateador.formatearNumero(resultado.a)} {resultado.simbolo} {formateador.formatearNumero(resultado.b)}
          </span>
        </div>
      </>
    );
  }, [error, resultado]);

  return (
    <PanelProceso
      formulario={
        <div className="tarjeta">
          <h2>Operaciones básicas</h2>
          <p className="descripcion">
            Calcula suma, resta, multiplicación y división de forma rápida y clara.
          </p>

          <div className="campo">
            <label className="etiqueta" htmlFor="op-a">Primer número (A)</label>
            <input
              id="op-a"
              type="number"
              inputMode="decimal"
              placeholder="Ej.: 25"
              value={a}
              onChange={(evento) => setA(evento.target.value)}
            />
          </div>

          <div className="campo">
            <label className="etiqueta" htmlFor="op-b">Segundo número (B)</label>
            <input
              id="op-b"
              type="number"
              inputMode="decimal"
              placeholder="Ej.: 4"
              value={b}
              onChange={(evento) => setB(evento.target.value)}
            />
          </div>

          <span className="etiqueta">Elige la operación</span>
          <div className="botones-op">
            {OPERACIONES.map((operacion) => (
              <button
                key={operacion.simbolo}
                type="button"
                className="boton-op"
                title={operacion.nombre}
                onClick={() => ejecutar(operacion)}
              >
                {operacion.simbolo}
              </button>
            ))}
          </div>

          <button type="button" className="boton-secundario" onClick={limpiar}>
            Limpiar todo
          </button>
        </div>
      }
      comprobante={
        <Comprobante
          cabecera="Comprobante · Operación"
          error={error}
          mostrarVacio={!error && !resultado}
          vacioTitulo="Sin resultados"
          vacioTexto="Escribe A y B y selecciona una operación para ver el comprobante."
        >
          {comprobante}
          {historial.length > 0 && (
            <>
              <div className="divisor" />
              <p className="ticket-subtitulo">Historial reciente</p>
              <ul className="historial">
                {historial.map((item, indice) => (
                  <li key={`${item.simbolo}-${indice}`}>
                    {formateador.formatearNumero(item.a)} {item.simbolo} {formateador.formatearNumero(item.b)} = {formateador.formatearNumero(item.valor)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Comprobante>
      }
    />
  );
}
