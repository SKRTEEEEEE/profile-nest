# syntax=docker/dockerfile:1
FROM node:22-bullseye-slim AS build

WORKDIR /app

# 1) Instala git + herramientas para compilar módulos nativos (si fueran necesarias)
RUN apt-get update \
  && apt-get install -y --no-install-recommends git build-essential python3 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# 2) Copia package files para aprovechar cache de Docker
COPY package*.json ./

# 3) Configura NPM para GitHub Packages y instala dependencias
# IMPORTANTE: Usa BuildKit secret si está disponible, sino usa ARG como fallback para Railway
# Railway: Pasa NPM_TOKEN como variable de entorno que se convierte en ARG
ARG GITHUB_TOKEN
RUN --mount=type=secret,id=npm_token \
  TOKEN=$(cat /run/secrets/npm_token 2>/dev/null || echo "$GITHUB_TOKEN") && \
  echo "@skrteeeeee:registry=https://npm.pkg.github.com" > ~/.npmrc && \
  echo "//npm.pkg.github.com/:_authToken=${TOKEN}" >> ~/.npmrc && \
  npm ci --prefer-offline --no-audit --progress=false && \
  rm -f ~/.npmrc

# 4) Copia .npmrc del proyecto (sin el token) para runtime si es necesario
COPY .npmrc ./

# 6) Copia el resto del proyecto
COPY . .

# 7) ELIMINA submodule domain si existe (forzamos uso del package)
RUN rm -rf src/domain && echo "✅ Submodule removed - using package instead"

# 8) Build (TypeScript / Nest build) - usará el package @skrteeeeee/profile-domain
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

# Usa el usuario node para seguridad
USER node

CMD ["node", "dist/src/main"]
