FROM node:22-bullseye-slim AS build

WORKDIR /app

# 1) Instala git + herramientas para compilar módulos nativos (si fueran necesarias)

# 2) Copia solo package.json + lockfile para aprovechar cache de Docker
COPY package*.json ./

# 3) Railway config: Copia .npmrc con ${NPM_TOKEN} placeholder  
COPY .npmrc package*.json ./

# 4) Railway sustituye automáticamente ${NPM_TOKEN} cuando npm lee el .npmrc
# Necesitamos setear NPM_TOKEN como variable para que npm lo vea
ARG NPM_TOKEN
RUN test -n "$NPM_TOKEN" || (echo "ERROR: NPM_TOKEN not set" && exit 1)
RUN NPM_TOKEN=$NPM_TOKEN npm ci --prefer-offline --no-audit --progress=false

# 4) Copia el resto del proyecto (incluye .git si no está en .dockerignore)
COPY . .

# 5) Build (TypeScript imports directly from @skrteeeeee/profile-domain package)
RUN npm run build

# 7) Elimina devDependencies para dejar solo lo necesario en producción
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