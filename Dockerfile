# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./
RUN npm install

# Copia el resto del proyecto y compila
COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine

WORKDIR /app

# Solo copia lo necesario desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Usa el puerto que Railway espera
ENV PORT=3000

CMD ["node", "dist/main"]
