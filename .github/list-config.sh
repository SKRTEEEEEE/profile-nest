#!/bin/bash

echo "🔍 Listando archivos de configuración del proyecto..."
echo "=================================================="

# Archivos de configuración comunes (solo archivos, no carpetas)
find . -maxdepth 1 -type f \( \
  -name ".*" -o \
  -name "*.config.*" -o \
  -name "*.json" -o \
  -name "*.yml" -o \
  -name "*.yaml" -o \
  -name "*.mjs" -o \
  -name "*.ts" -o \
  -name "Dockerfile*" -o \
  -name "docker-compose*" -o \
  -name "nodemon*" -o \
  -name "commitlint*" -o \
  -name "lint-staged*" \
\) | grep -v node_modules | sort

echo ""
echo "🗂️  Archivos en .github/ (excluyendo carpetas)..."
echo "=============================================="
find .github -type f 2>/dev/null | sort

echo ""
echo "🛠️  Archivos TypeScript/JavaScript de configuración..."
echo "=================================================="
find . -maxdepth 2 -type f \( \
  -name "*.config.ts" -o \
  -name "*.config.js" -o \
  -name "*.config.mjs" -o \
  -name "jest.*" -o \
  -name "vitest.*" -o \
  -name "webpack.*" -o \
  -name "vite.*" -o \
  -name "rollup.*" \
\) | grep -v node_modules | sort

echo ""
echo "📋 Archivos package y lock..."
echo "=========================="
find . -maxdepth 1 -type f \( \
  -name "package*.json" -o \
  -name "*lock*" -o \
  -name "yarn.lock" -o \
  -name "pnpm-lock.yaml" \
\) | sort

echo ""
