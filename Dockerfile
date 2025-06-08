# Usa una imagen base adecuada para Node.js y NestJS
FROM node:22-alpine AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto (incluyendo .gitmodules)
COPY . .

# Paso crucial: Inicializar y actualizar los submódulos
# Asegúrate de que git esté disponible en tu imagen base.
# Si estás en una imagen "slim" o "alpine", puede que necesites instalar git.
RUN apk add --no-cache git && \
    git submodule update --init --recursive

# Instala las dependencias
RUN npm install

# Construye la aplicación NestJS
RUN npm run build

# Segunda etapa para la producción (más ligera)
FROM node:22-alpine AS production

WORKDIR /app

# Copia solo los archivos necesarios de la etapa de construcción
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Define el comando de inicio
CMD ["node", "dist/main"]