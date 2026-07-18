# Panel de Procesos · React + Docker

Aplicación web desarrollada en **React 18 + Vite** que integra **4 componentes con procesos diferentes**, desplegada en **Docker** con un build multi-etapa (Node para compilar, Nginx para servir en producción).

Desarrollado por **Isaac Betún** · Tecnología Superior en Desarrollo de Software.

## Los 4 componentes

| # | Componente | Archivo | Proceso que realiza |
|---|------------|---------|---------------------|
| 1 | Operaciones básicas | `src/components/OperacionesBasicas.jsx` | Suma, resta, multiplicación y división de dos números, con validación de división para cero e historial de operaciones. |
| 2 | Cálculo de IMC | `src/components/CalculoIMC.jsx` | Índice de masa corporal (peso / estatura²) con clasificación según rangos de la OMS y barra visual del resultado. |
| 3 | Cálculos IESS | `src/components/CalculosIESS.jsx` | Rol de pagos mensual ecuatoriano: aporte personal (9,45 %), aporte patronal (12,15 %), fondos de reserva (8,33 %), líquido a recibir y costo total para el empleador. |
| 4 | Conversor de temperatura | `src/components/ConversorTemperatura.jsx` | Equivalencias entre Celsius, Fahrenheit y Kelvin con validación del cero absoluto. |

## Estructura del proyecto

```
panel-procesos/
├── Dockerfile              → Build multi-etapa (Node 20 + Nginx)
├── docker-compose.yml      → Levanta el contenedor con un comando
├── nginx.conf              → Configuración de Nginx para la SPA
├── .dockerignore           → Excluye node_modules y dist del contexto
├── package.json            → Dependencias y scripts
├── vite.config.js          → Configuración de Vite
├── index.html              → HTML raíz (carga fuentes y la app)
└── src/
    ├── main.jsx            → Punto de entrada de React
    ├── App.jsx             → Navegación entre los 4 procesos
    ├── index.css           → Sistema de diseño completo
    └── components/
        ├── OperacionesBasicas.jsx
        ├── CalculoIMC.jsx
        ├── CalculosIESS.jsx
        └── ConversorTemperatura.jsx
```

## Requisitos

- **Docker** (Docker Desktop en Windows o Docker Engine en el entorno de KillerCoda). Verificar con:

```bash
docker --version
docker compose version
```

- **Git** para clonar el repositorio en el entorno de despliegue.
- *(Opcional, solo para desarrollo local sin Docker)*: Node.js 18 o superior.

> **Entrega:** este proyecto se entrega **subido a un repositorio Git** (GitHub), no como archivo comprimido. El despliegue en KillerCoda clona directamente ese repositorio.

## Opción A · Despliegue con Docker Compose (recomendado)

Desde la carpeta raíz del proyecto (`panel-procesos/`):

```bash
docker compose up -d --build
```

Abrir en el navegador: **http://localhost:8080**

Comandos útiles:

```bash
docker compose ps          # Ver el estado del contenedor
docker compose logs -f     # Ver los logs de Nginx
docker compose down        # Detener y eliminar el contenedor
```

> Si tu instalación usa la versión antigua de Compose, reemplaza `docker compose` por `docker-compose`.

## Opción B · Despliegue con Docker manual

```bash
# 1. Construir la imagen
docker build -t panel-procesos:1.0 .

# 2. Ejecutar el contenedor (puerto 8080 del equipo → puerto 80 del contenedor)
docker run -d --name panel-procesos -p 8080:80 --restart unless-stopped panel-procesos:1.0

# 3. Verificar que está corriendo
docker ps
```

Abrir en el navegador: **http://localhost:8080**

Para detener y eliminar:

```bash
docker stop panel-procesos
docker rm panel-procesos
docker rmi panel-procesos:1.0   # (opcional) eliminar la imagen
```

## Opción C · Despliegue en KillerCoda (entorno online)

[KillerCoda](https://killercoda.com/) ofrece una terminal con Docker en el navegador, sin instalar nada. Es la forma de despliegue indicada por el docente.

1. Ingresa a un escenario con Docker, por ejemplo el **Docker Playground** de KillerCoda (`https://killercoda.com/playgrounds/scenario/docker`).
2. En la terminal, clona tu repositorio (reemplaza la URL por la de tu GitHub):

   ```bash
   git clone https://github.com/USUARIO/panel-procesos.git
   cd panel-procesos
   ```

3. Construye la imagen y levanta el contenedor en el puerto 80:

   ```bash
   docker build -t panel-procesos:1.0 .
   docker run -d --name panel-procesos -p 80:80 panel-procesos:1.0
   ```

4. Verifica que el contenedor esté corriendo:

   ```bash
   docker ps
   ```

5. Abre la aplicación con el **Traffic Port Accessor** de KillerCoda: haz clic en el signo **+** de la parte superior de la terminal → **Select port to view on Host** → escribe el puerto **80** → **Access**. Se abrirá una pestaña con la aplicación desplegada.

> Toma capturas de pantalla de estos pasos (clonación, `docker build`, `docker ps` y la app abierta en el navegador) para incluirlas en el informe.

## Cómo funciona el Dockerfile (build multi-etapa)

1. **Etapa `build` (node:20-alpine):** instala las dependencias con `npm ci` y ejecuta `npm run build`, que genera los archivos estáticos optimizados en `/app/dist`.
2. **Etapa de producción (nginx:alpine):** copia únicamente la carpeta `dist` y la configuración `nginx.conf`. La imagen final pesa alrededor de 50 MB porque no incluye Node ni `node_modules`.
3. `nginx.conf` aplica la regla `try_files ... /index.html`, necesaria para que las SPA de React funcionen al recargar la página, además de compresión gzip y caché de los assets.

## Desarrollo local (sin Docker)

```bash
npm install
npm run dev
```

Abrir **http://localhost:5173**. Para generar el build de producción manualmente: `npm run build` (resultado en `dist/`).

## Notas técnicas

- Los porcentajes del componente IESS son las tarifas referenciales del sector privado en relación de dependencia: aporte personal 9,45 %, aporte patronal 12,15 % (incluye IECE 0,5 % y SECAP 0,5 %) y fondos de reserva mensualizados 8,33 %.
- Los valores monetarios se formatean con `Intl.NumberFormat('es-EC', { currency: 'USD' })`.
- El componente de IMC usa los rangos de referencia de la OMS con fines educativos.
- El puerto publicado se puede cambiar en `docker-compose.yml` (por ejemplo `"3000:80"`).
