export class Formateador {
  constructor(region = 'es-EC', moneda = 'USD') {
    this.region = region;
    this.moneda = moneda;
    this.numero = new Intl.NumberFormat(region, {
      maximumFractionDigits: 2,
    });
    this.numeroCompleto = new Intl.NumberFormat(region, {
      maximumFractionDigits: 6,
    });
    this.monedaFormatter = new Intl.NumberFormat(region, {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 2,
    });
  }

  formatearNumero(valor, opciones = {}) {
    return this.numeroCompleto.format(valor, opciones);
  }

  formatearMoneda(valor) {
    return this.monedaFormatter.format(valor);
  }
}

export const formateador = new Formateador();
