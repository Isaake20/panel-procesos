const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  PageNumber, Header, Footer, Table, TableRow, TableCell, WidthType,
  BorderStyle, ShadingType, PageBreak, LevelFormat, TabStopType, TabStopPosition,
} = require('docx');

const TINTA = '16203B';
const ACENTO = '2456E6';
const GRIS = '5A6478';
const LINEA = 'D9DEE8';

// ---- Helpers -------------------------------------------------------------
const H1 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 140 },
    children: [new TextRun({ text, bold: true, size: 30, color: TINTA, font: 'Times New Roman' })],
  });

const H2 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 100 },
    children: [new TextRun({ text, bold: true, size: 26, color: ACENTO, font: 'Times New Roman' })],
  });

const P = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: 120, line: 276 },
    alignment: opts.justify === false ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: 24, color: TINTA, font: 'Times New Roman' })],
  });

// Párrafo con partes mixtas (negrita inline)
const PMix = (runs) =>
  new Paragraph({
    spacing: { after: 120, line: 276 },
    alignment: AlignmentType.JUSTIFIED,
    children: runs.map((r) =>
      new TextRun({ text: r.t, bold: !!r.b, size: 24, color: TINTA, font: 'Times New Roman' })
    ),
  });

const Bullet = (text) =>
  new Paragraph({
    numbering: { reference: 'vinetas', level: 0 },
    spacing: { after: 80, line: 276 },
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: 24, color: TINTA, font: 'Times New Roman' })],
  });

const Code = (text) =>
  new Paragraph({
    spacing: { after: 40, before: 40 },
    shading: { type: ShadingType.CLEAR, fill: 'F2F4F8' },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: LINEA },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: LINEA },
      left: { style: BorderStyle.SINGLE, size: 4, color: LINEA },
      right: { style: BorderStyle.SINGLE, size: 4, color: LINEA },
    },
    children: [new TextRun({ text, font: 'Consolas', size: 20, color: '1B2A4A' })],
  });

// Recuadro donde el estudiante pega su captura de pantalla
const Captura = (instruccion) =>
  new Paragraph({
    spacing: { before: 120, after: 160 },
    alignment: AlignmentType.CENTER,
    shading: { type: ShadingType.CLEAR, fill: 'EEF1F6' },
    border: {
      top: { style: BorderStyle.DASHED, size: 8, color: ACENTO },
      bottom: { style: BorderStyle.DASHED, size: 8, color: ACENTO },
      left: { style: BorderStyle.DASHED, size: 8, color: ACENTO },
      right: { style: BorderStyle.DASHED, size: 8, color: ACENTO },
    },
    children: [
      new TextRun({ text: '🖼  ', size: 24 }),
      new TextRun({ text: instruccion, italics: true, size: 22, color: GRIS, font: 'Times New Roman' }),
    ],
  });

const Figura = (n, texto) =>
  new Paragraph({
    spacing: { after: 200 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: `Figura ${n}. `, bold: true, size: 20, color: TINTA, font: 'Times New Roman' }),
      new TextRun({ text: texto, size: 20, color: GRIS, font: 'Times New Roman' }),
    ],
  });

// ---- Tabla de componentes -----------------------------------------------
const th = (t) =>
  new TableCell({
    width: { size: t.w, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: ACENTO },
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: [new Paragraph({ children: [new TextRun({ text: t.t, bold: true, color: 'FFFFFF', size: 20, font: 'Times New Roman' })] })],
  });

const td = (text, w, fill) =>
  new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: fill ? { type: ShadingType.CLEAR, fill } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: [new Paragraph({ children: [new TextRun({ text, size: 20, color: TINTA, font: 'Times New Roman' })] })],
  });

const COLS = [560, 2200, 6240];
const tablaComponentes = new Table({
  columnWidths: COLS,
  width: { size: 9000, type: WidthType.DXA },
  rows: [
    new TableRow({ tableHeader: true, children: [th({ t: '#', w: COLS[0] }), th({ t: 'Componente', w: COLS[1] }), th({ t: 'Proceso que realiza', w: COLS[2] })] }),
    new TableRow({ children: [td('1', COLS[0]), td('Operaciones básicas', COLS[1]), td('Suma, resta, multiplicación y división de dos números, con validación de división para cero e historial de las operaciones realizadas.', COLS[2])] }),
    new TableRow({ children: [td('2', COLS[0], 'F7F9FC'), td('Cálculo de IMC', COLS[1], 'F7F9FC'), td('Índice de masa corporal (peso / estatura²), con clasificación según los rangos de la OMS y una barra visual del resultado.', COLS[2], 'F7F9FC')] }),
    new TableRow({ children: [td('3', COLS[0]), td('Cálculos IESS', COLS[1]), td('Rol de pagos mensual: aporte personal (9,45 %), aporte patronal (12,15 %), fondos de reserva (8,33 %), líquido a recibir y costo total para el empleador.', COLS[2])] }),
    new TableRow({ children: [td('4', COLS[0], 'F7F9FC'), td('Conversor de temperatura', COLS[1], 'F7F9FC'), td('Conversión entre Celsius, Fahrenheit y Kelvin, con validación del cero absoluto (−273,15 °C).', COLS[2], 'F7F9FC')] }),
  ],
});

// ---- Portada -------------------------------------------------------------
const portada = [
  new Paragraph({ spacing: { before: 1200, after: 0 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'INFORME TÉCNICO', bold: true, size: 28, color: ACENTO, font: 'Times New Roman' })] }),
  new Paragraph({ spacing: { before: 200, after: 0 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Aplicación web con cuatro componentes y despliegue en Docker', bold: true, size: 40, color: TINTA, font: 'Times New Roman' })] }),
  new Paragraph({ spacing: { before: 160, after: 900 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Panel de Procesos — React + Vite', size: 26, color: GRIS, font: 'Times New Roman' })] }),
  new Paragraph({ spacing: { after: 60 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Autor: Isaac Geovanny Betún Vergara', size: 24, color: TINTA, font: 'Times New Roman' })] }),
  new Paragraph({ spacing: { after: 60 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Carrera: Tecnología Superior en Desarrollo de Software', size: 24, color: TINTA, font: 'Times New Roman' })] }),
  new Paragraph({ spacing: { after: 60 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Asignatura: [ completar — p. ej. Programación Integradora ]', size: 24, color: GRIS, font: 'Times New Roman' })] }),
  new Paragraph({ spacing: { after: 60 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Docente: [ completar ]     NRC: [ completar ]', size: 24, color: GRIS, font: 'Times New Roman' })] }),
  new Paragraph({ spacing: { after: 60 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Fecha: [ completar ]', size: 24, color: GRIS, font: 'Times New Roman' })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- Cuerpo --------------------------------------------------------------
const cuerpo = [
  H1('1. Introducción'),
  P('El presente informe documenta el desarrollo y despliegue de una aplicación web denominada «Panel de Procesos», construida con la biblioteca React y la herramienta de compilación Vite. La aplicación integra cuatro componentes independientes, cada uno encargado de un proceso de cálculo diferente, y se despliega mediante contenedores Docker. Adicionalmente, se describe el proceso de despliegue en el entorno en línea KillerCoda, el cual clona el repositorio Git del proyecto para ejecutarlo.'),
  P('El objetivo académico es demostrar la separación de responsabilidades en componentes, la validación de datos de entrada y la contenerización de una aplicación de una sola página (SPA) para su publicación.'),

  H1('2. Objetivos'),
  H2('2.1. Objetivo general'),
  P('Desarrollar una aplicación web en React compuesta por cuatro componentes con procesos diferenciados y desplegarla mediante Docker.'),
  H2('2.2. Objetivos específicos'),
  Bullet('Implementar cuatro componentes funcionales: operaciones básicas, cálculo de IMC, cálculos del IESS y conversor de temperatura.'),
  Bullet('Aplicar validación de datos de entrada en cada proceso para evitar resultados inconsistentes.'),
  Bullet('Contenerizar la aplicación con un Dockerfile de múltiples etapas que optimice el tamaño de la imagen final.'),
  Bullet('Desplegar la aplicación en el entorno KillerCoda a partir del repositorio Git.'),

  H1('3. Herramientas y tecnologías'),
  Bullet('React 18 y Vite 5: biblioteca de interfaz y empaquetador para el desarrollo del frontend.'),
  Bullet('JavaScript (ES6+) y CSS3: lógica de los procesos y sistema de estilos.'),
  Bullet('Docker: contenerización mediante un build multi-etapa (Node 20 para compilar y Nginx para servir).'),
  Bullet('Nginx: servidor web que entrega los archivos estáticos en producción.'),
  Bullet('Git y GitHub: control de versiones y alojamiento del repositorio.'),
  Bullet('KillerCoda: entorno en línea con Docker para el despliegue.'),

  H1('4. Descripción de la aplicación'),
  P('La aplicación presenta una barra de navegación superior que permite alternar entre los cuatro procesos. Cada proceso se implementa como un componente React independiente, con su propio estado y color de acento, y muestra el resultado en un formato de comprobante. La siguiente tabla resume cada componente:'),
  tablaComponentes,
  new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: 'Tabla 1. Componentes de la aplicación y su proceso.', italics: true, size: 20, color: GRIS, font: 'Times New Roman' })] }),

  H2('4.1. Componente 1 — Operaciones básicas'),
  PMix([{ t: 'Recibe dos números reales y aplica la operación seleccionada (', b: false }, { t: '+, −, ×, ÷', b: true }, { t: '). Valida que ambos campos contengan números y bloquea la división para cero, mostrando un mensaje de error. Conserva un historial con las últimas seis operaciones realizadas.', b: false }]),

  H2('4.2. Componente 2 — Cálculo de IMC'),
  PMix([{ t: 'Calcula el índice de masa corporal con la fórmula ', b: false }, { t: 'IMC = peso (kg) / estatura² (m²)', b: true }, { t: '. La estatura se ingresa en centímetros y se convierte a metros. El resultado se clasifica en bajo peso, peso normal, sobrepeso u obesidad según los rangos de referencia de la OMS, y se representa sobre una barra de colores con un marcador.', b: false }]),

  H2('4.3. Componente 3 — Cálculos IESS'),
  P('A partir del sueldo mensual, genera un rol de pagos con los aportes al Instituto Ecuatoriano de Seguridad Social para un trabajador del sector privado en relación de dependencia. Calcula el aporte personal (9,45 %), el aporte patronal (12,15 %, que incluye IECE y SECAP), los fondos de reserva mensualizados (8,33 %, opcionales), el líquido a recibir por el trabajador y el costo total mensual para el empleador. Los valores se muestran en dólares estadounidenses.'),

  H2('4.4. Componente 4 — Conversor de temperatura'),
  PMix([{ t: 'Convierte un valor entre las escalas Celsius, Fahrenheit y Kelvin usando las fórmulas ', b: false }, { t: '°F = °C × 9/5 + 32', b: true }, { t: ' y ', b: false }, { t: 'K = °C + 273,15', b: true }, { t: '. Valida que el valor no se encuentre por debajo del cero absoluto, ya que no correspondería a una temperatura físicamente posible.', b: false }]),

  H1('5. Estructura del proyecto'),
  P('El proyecto se organiza de la siguiente manera; cada componente reside en su propio archivo dentro de la carpeta src/components:'),
  Code('panel-procesos/'),
  Code('├── Dockerfile              → Build multi-etapa (Node 20 + Nginx)'),
  Code('├── docker-compose.yml      → Levanta el contenedor'),
  Code('├── nginx.conf              → Configuración de Nginx (SPA)'),
  Code('├── package.json            → Dependencias y scripts'),
  Code('├── index.html              → HTML raíz'),
  Code('└── src/'),
  Code('    ├── App.jsx             → Navegación entre los 4 procesos'),
  Code('    ├── main.jsx            → Punto de entrada de React'),
  Code('    ├── index.css           → Sistema de estilos'),
  Code('    └── components/'),
  Code('        ├── OperacionesBasicas.jsx'),
  Code('        ├── CalculoIMC.jsx'),
  Code('        ├── CalculosIESS.jsx'),
  Code('        └── ConversorTemperatura.jsx'),

  new Paragraph({ children: [new PageBreak()] }),
  H1('6. Capturas de la aplicación en funcionamiento'),
  P('A continuación se presentan las capturas de cada componente en ejecución. Se recomienda mostrar un cálculo de ejemplo con su resultado en cada uno.'),
  Captura('Inserta aquí la captura del componente «Operaciones básicas» con una operación resuelta.'),
  Figura('1', 'Componente de operaciones básicas.'),
  Captura('Inserta aquí la captura del componente «Cálculo de IMC» mostrando la categoría y la barra.'),
  Figura('2', 'Componente de cálculo de IMC.'),
  Captura('Inserta aquí la captura del componente «Cálculos IESS» con el rol de pagos generado.'),
  Figura('3', 'Componente de cálculos del IESS.'),
  Captura('Inserta aquí la captura del componente «Conversor de temperatura» con las equivalencias.'),
  Figura('4', 'Componente conversor de temperatura.'),

  new Paragraph({ children: [new PageBreak()] }),
  H1('7. Despliegue en Docker'),
  P('La aplicación se conteneriza con un Dockerfile de dos etapas. En la primera etapa, una imagen de Node 20 instala las dependencias y ejecuta la compilación de producción (npm run build), que genera los archivos estáticos en la carpeta dist. En la segunda etapa, una imagen de Nginx copia únicamente esos archivos y los sirve. De este modo, la imagen final no contiene Node ni las dependencias de desarrollo, y pesa aproximadamente 50 MB.'),
  P('La configuración de Nginx aplica la regla try_files para redirigir cualquier ruta hacia index.html, lo que permite que la aplicación de una sola página funcione correctamente al recargar la página.'),
  H2('7.1. Construcción y ejecución local'),
  Code('docker build -t panel-procesos:1.0 .'),
  Code('docker run -d --name panel-procesos -p 8080:80 panel-procesos:1.0'),
  P('Una vez ejecutado, la aplicación queda disponible en http://localhost:8080. También puede levantarse con un solo comando mediante docker compose up -d --build.'),
  Captura('Inserta aquí la captura de la ejecución de «docker build» y «docker run» en la terminal.'),
  Figura('5', 'Construcción y ejecución del contenedor.'),

  H1('8. Despliegue en KillerCoda'),
  P('El despliegue en el entorno en línea KillerCoda se realiza clonando el repositorio Git del proyecto, sin necesidad de subir archivos comprimidos. Los pasos son los siguientes:'),
  PMix([{ t: 'Paso 1. ', b: true }, { t: 'Ingresar a un escenario con Docker (Docker Playground de KillerCoda).', b: false }]),
  PMix([{ t: 'Paso 2. ', b: true }, { t: 'Clonar el repositorio y ubicarse en la carpeta del proyecto:', b: false }]),
  Code('git clone https://github.com/USUARIO/panel-procesos.git'),
  Code('cd panel-procesos'),
  PMix([{ t: 'Paso 3. ', b: true }, { t: 'Construir la imagen y ejecutar el contenedor en el puerto 80:', b: false }]),
  Code('docker build -t panel-procesos:1.0 .'),
  Code('docker run -d --name panel-procesos -p 80:80 panel-procesos:1.0'),
  PMix([{ t: 'Paso 4. ', b: true }, { t: 'Verificar el contenedor con «docker ps» y abrir la aplicación mediante el Traffic Port Accessor de KillerCoda, indicando el puerto 80.', b: false }]),
  Captura('Inserta aquí la captura de la clonación del repositorio (git clone) en KillerCoda.'),
  Figura('6', 'Clonación del repositorio en KillerCoda.'),
  Captura('Inserta aquí la captura de «docker ps» mostrando el contenedor en ejecución.'),
  Figura('7', 'Contenedor en ejecución.'),
  Captura('Inserta aquí la captura de la aplicación abierta desde el puerto expuesto en KillerCoda.'),
  Figura('8', 'Aplicación desplegada y accesible desde el navegador.'),

  H1('9. Repositorio'),
  PMix([{ t: 'El código fuente completo del proyecto se encuentra alojado en el siguiente repositorio Git:', b: false }]),
  new Paragraph({
    spacing: { after: 160, before: 40 },
    children: [new TextRun({ text: 'https://github.com/USUARIO/panel-procesos', bold: true, size: 24, color: ACENTO, font: 'Times New Roman', underline: {} })],
  }),
  P('(Reemplaza la URL anterior por la de tu repositorio real antes de entregar el informe.)', { justify: false }),

  H1('10. Conclusiones'),
  Bullet('Se desarrolló una aplicación web en React compuesta por cuatro componentes independientes, cada uno con un proceso de cálculo y validación de datos propio.'),
  Bullet('El uso de un Dockerfile multi-etapa permitió obtener una imagen de producción ligera, separando el entorno de compilación del de ejecución.'),
  Bullet('El despliegue mediante KillerCoda a partir del repositorio Git demostró un flujo de publicación reproducible que no depende de archivos comprimidos.'),
  Bullet('La organización del código en componentes facilita el mantenimiento y la incorporación de nuevos procesos en el futuro.'),
];

// ---- Documento -----------------------------------------------------------
const doc = new Document({
  creator: 'Isaac Betún',
  title: 'Informe - Panel de Procesos',
  numbering: {
    config: [
      { reference: 'vinetas', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 460, hanging: 260 } } } }] },
    ],
  },
  styles: {
    default: { document: { run: { font: 'Times New Roman', size: 24, color: TINTA } } },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Panel de Procesos — Informe técnico', size: 16, color: GRIS, font: 'Times New Roman' })] })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GRIS, font: 'Times New Roman' })] })],
        }),
      },
      children: [...portada, ...cuerpo],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync('/home/claude/panel-procesos/informe/Informe_Panel_de_Procesos.docx', buf);
  console.log('OK informe generado');
});
