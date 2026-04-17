# ─────────────────────────────────────────────
# Stage 1: Build (Bun)
# ─────────────────────────────────────────────
FROM oven/bun:alpine AS builder

WORKDIR /app

# Instalar dependencias usando el lockfile para reproducibilidad
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copiar fuentes
COPY . .

# VITE_API_URL se bake en el bundle de JS en tiempo de build.
# El valor debe ser la URL que el NAVEGADOR usa para llegar al backend.
ARG VITE_API_URL=http://localhost:8000/api/v1
ENV VITE_API_URL=${VITE_API_URL}

# Build SPA (sin SSR, sin Cloudflare adapter — salida en dist/spa/)
RUN bun run build:docker

# ─────────────────────────────────────────────
# Stage 2: Production (nginx)
# ─────────────────────────────────────────────
FROM nginx:alpine AS production

# Eliminar configuración por defecto de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuración personalizada con SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar assets estáticos del build
COPY --from=builder /app/dist/spa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
