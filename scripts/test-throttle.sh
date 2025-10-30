#!/bin/bash

# URL a la que se harán las peticiones
URL="http://localhost:3001/pre-tech?q=loc"

# Número de peticiones concurrentes
NUM_REQUESTS=20

echo "Haciendo $NUM_REQUESTS peticiones concurrentes a $URL..."

for i in $(seq 1 $NUM_REQUESTS); do
  curl -s "$URL" &
done

# Espera a que terminen todas las peticiones
wait

echo "Todas las peticiones han finalizado."
