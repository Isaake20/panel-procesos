# =========================================================
# Etapa 1 · BUILD: compila la aplicación React con Vite
# =========================================================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar solo los manifiestos primero para aprovechar la caché de capas
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el resto del código fuente y generar el build de producción (carpeta /app/dist)
COPY . .
RUN npm run build

# =========================================================
# Etapa 2 · PRODUCCIÓN: sirve los archivos estáticos con Nginx
# =========================================================
FROM nginx:alpine

# Configuración de Nginx para una SPA (Single Page Application)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar únicamente el build generado en la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
