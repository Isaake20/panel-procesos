import { formateador } from './formateador';

class ProcesadorBase {
  constructor(formateadorInstancia = formateador) {
    this.formateador = formateadorInstancia;
  }

  normalizarNumero(valor) {
    return Number.parseFloat(String(valor).replace(',', '.'));
  }

  esNumeroValido(valor) {
    return Number.isFinite(valor) && valor > 0;
  }
}

export class CalculadoraIMC extends ProcesadorBase {
  static CATEGORIAS = [
    { max: 18.5, nombre: 'Bajo peso', color: '#2E6FE8' },
    { max: 25, nombre: 'Peso normal', color: '#0E8A5F' },
    { max: 30, nombre: 'Sobrepeso', color: '#DFA000' },
    { max: Infinity, nombre: 'Obesidad', color: '#D43D2A' },
  ];

  static BARRA_MIN = 10;
  static BARRA_MAX = 45;

  calcular(peso, estaturaCm) {
    const pesoKg = this.normalizarNumero(peso);
    const estatura = this.normalizarNumero(estaturaCm);

    if (!this.esNumeroValido(pesoKg) || !this.esNumeroValido(estatura)) {
      throw new Error('Ingresa un peso y una estatura mayores que cero.');
    }

    const estaturaM = estatura / 100;
    const imc = pesoKg / (estaturaM * estaturaM);
    const categoria = CalculadoraIMC.CATEGORIAS.find((item) => imc < item.max);

    return { imc, categoria };
  }

  obtenerPosicionMarcador(imc) {
    const rango = CalculadoraIMC.BARRA_MAX - CalculadoraIMC.BARRA_MIN;
    return Math.min(100, Math.max(0, ((imc - CalculadoraIMC.BARRA_MIN) / rango) * 100));
  }
}

export class CalculadoraIESS extends ProcesadorBase {
  static TARIFAS = {
    personal: 0.0945,
    patronal: 0.1215,
    fondos: 0.0833,
  };

  calcular(sueldoMensual, incluirFondos = false) {
    const sueldo = this.normalizarNumero(sueldoMensual);

    if (!this.esNumeroValido(sueldo)) {
      throw new Error('Ingresa un sueldo mensual mayor que cero.');
    }

    const aportePersonal = sueldo * CalculadoraIESS.TARIFAS.personal;
    const aportePatronal = sueldo * CalculadoraIESS.TARIFAS.patronal;
    const fondosReserva = incluirFondos ? sueldo * CalculadoraIESS.TARIFAS.fondos : 0;
    const liquidoRecibir = sueldo - aportePersonal + fondosReserva;
    const costoEmpleador = sueldo + aportePatronal + fondosReserva;

    return {
      sueldoMensual: sueldo,
      aportePersonal,
      aportePatronal,
      fondosReserva,
      liquidoRecibir,
      costoEmpleador,
    };
  }
}

export class ConversorTemperatura extends ProcesadorBase {
  static CERO_ABSOLUTO_C = -273.15;

  convertir(valor, unidadOrigen) {
    const numero = this.normalizarNumero(valor);

    if (!Number.isFinite(numero)) {
      throw new Error('Ingresa un valor numérico de temperatura.');
    }

    const celsius = this.aCelsius(numero, unidadOrigen);

    if (celsius < ConversorTemperatura.CERO_ABSOLUTO_C) {
      throw new Error('El valor está por debajo del cero absoluto (−273,15 °C); no es una temperatura física.');
    }

    return {
      c: celsius,
      f: (celsius * 9) / 5 + 32,
      k: celsius + 273.15,
      origen: unidadOrigen,
    };
  }

  aCelsius(valor, unidad) {
    if (unidad === 'C') return valor;
    if (unidad === 'F') return ((valor - 32) * 5) / 9;
    return valor - 273.15;
  }
}
