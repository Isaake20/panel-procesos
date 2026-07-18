import { useState } from 'react';
import OperacionesBasicas from './components/OperacionesBasicas';
import CalculoIMC from './components/CalculoIMC';
import CalculosIESS from './components/CalculosIESS';
import ConversorTemperatura from './components/ConversorTemperatura';

const PROCESOS = [
  {
    id: 'operaciones',
    codigo: 'OP',
    etiqueta: 'Operaciones básicas',
    color: '#2456E6',
    Componente: OperacionesBasicas,
  },
  {
    id: 'imc',
    codigo: 'IMC',
    etiqueta: 'Cálculo de IMC',
    color: '#0E8A5F',
    Componente: CalculoIMC,
  },
  {
    id: 'iess',
    codigo: 'IESS',
    etiqueta: 'Cálculos IESS',
    color: '#C77800',
    Componente: CalculosIESS,
  },
  {
    id: 'temperatura',
    codigo: '°T',
    etiqueta: 'Conversor de temperatura',
    color: '#D43D2A',
    Componente: ConversorTemperatura,
  },
];

export default function App() {
  const [activoId, setActivoId] = useState(PROCESOS[0].id);
  const activo = PROCESOS.find((proceso) => proceso.id === activoId) ?? PROCESOS[0];

  return (
    <div className="contenedor">
      <header className="cabecera">
        <p className="eyebrow">Panel de procesos · React · Docker · Vite</p>
        <h1>Panel de Procesos</h1>
        <p className="cabecera-sub">
          Selecciona una herramienta y observa el resultado como si fuese un comprobante claro, directo y fácil de leer.
        </p>
      </header>

      <nav className="pestanas" aria-label="Procesos disponibles">
        {PROCESOS.map((proceso) => (
          <button
            key={proceso.id}
            type="button"
            className={`pestana${proceso.id === activoId ? ' activa' : ''}`}
            style={{ '--acento': proceso.color }}
            aria-pressed={proceso.id === activoId}
            onClick={() => setActivoId(proceso.id)}
          >
            <span className="pestana-codigo">{proceso.codigo}</span>
            {proceso.etiqueta}
          </button>
        ))}
      </nav>

      <main key={activo.id} className="escenario" style={{ '--acento': activo.color }}>
        <activo.Componente />
      </main>

      <footer className="pie">
        <span>Desarrollado por Isaac Betún · Tecnología Superior en Desarrollo de Software</span>
        <span>React + Vite · Nginx + Docker</span>
      </footer>
    </div>
  );
}
