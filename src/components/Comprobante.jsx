export default function Comprobante({
  cabecera,
  error = '',
  children,
  mostrarVacio = false,
  vacioTitulo = 'Sin resultados',
  vacioTexto = 'Aún no hay información para mostrar.',
}) {
  return (
    <aside className="ticket" aria-live="polite">
      <p className="ticket-cabecera">{cabecera}</p>

      {error && <p className="alerta" role="alert">{error}</p>}

      {!error && children}

      {!error && mostrarVacio && (
        <div className="vacio">
          <p className="vacio-titulo">{vacioTitulo}</p>
          <p>{vacioTexto}</p>
        </div>
      )}
    </aside>
  );
}
