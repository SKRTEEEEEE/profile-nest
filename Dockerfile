# syntax=docker/dockerfile:1
FROM node:22-bullseye-slim AS build

WORKDIR /app

# 1) Instala git + herramientas para compilar módulos nativos (si fueran necesarias)
RUN apt-get update \
  && apt-get install -y --no-install-recommends git build-essential python3 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# 2) Copia solo package.json + lockfile para aprovechar cache de Docker
COPY package*.json ./

# 3) Instala TODAS las dependencias (incluyendo devDependencies necesarias para el build)
RUN npm ci --prefer-offline --no-audit --progress=false

# 4) Copia el resto del proyecto (incluye .git si no está en .dockerignore)
COPY . .

# 5) Inicializa submódulos SOLO si hay .git (evita fallos si .git no fue incluido)
RUN if [ -d .git ]; then git submodule update --init --recursive; fi

# 6) Fallback: si .git no está pero hay .gitmodules, clona cada submódulo público según el .gitmodules
RUN if [ ! -d .git ] && [ -f .gitmodules ]; then \
      awk '/path =/ {p=$3} /url =/ {print $3 " " p}' .gitmodules | \
      while read url path; do \
        echo "Cloning $url into $path" && git clone "$url" "$path"; \
      done; \
    fi

# 7) Build (TypeScript / Nest build)
RUN npm run build

# 8) Elimina devDependencies para dejar solo lo necesario en producción
RUN npm prune --production

# ===== Producción (imagen final pequeña) =====
FROM node:22-bullseye-slim AS production

WORKDIR /app

# Copia artefactos construidos y node_modules ya pruneados
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]
