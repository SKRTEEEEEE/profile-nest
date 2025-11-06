# 🚀 Quick Start - Ejecutar Tests

## ⚡ Opción Rápida: Docker

### Windows:
```bash
scripts\run-tests-docker.bat
```

### Linux/Mac:
```bash
chmod +x scripts/run-tests-docker.sh
./scripts/run-tests-docker.sh
```

## 💻 Opción Local: npm

```bash
# 1. Instalar dependencias (si no lo has hecho)
npm ci

# 2. Ejecutar tests con cobertura
npm run test:cov
```

## 📊 Ver Resultados

Después de ejecutar los tests, abre:
```
coverage/unit/lcov-report/index.html
```

## ✅ Verificar Cobertura

Debe mostrar:
- ✅ Statements: ≥ 80%
- ✅ Branches: ≥ 80%
- ✅ Functions: ≥ 80%
- ✅ Lines: ≥ 80%

## 🔄 Siguiente Paso: Push a GitHub

Una vez que los tests pasen localmente:

```bash
git add .
git commit -m "test: add comprehensive test coverage for 80%+ goal"
git push
```

La GitHub Action ejecutará los tests automáticamente y actualizará los badges de cobertura.

## 🏅 Badges en README

Los badges se actualizarán automáticamente cuando hagas push a `main`:

![Coverage Total](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/SKRTEEEEEE/profile-nest/main/.github/badges/coverage-total.json)

## ❓ Problemas Comunes

### Tests muy lentos
**Solución**: Usa Docker o ejecuta solo tests específicos:
```bash
npm run test -- --testPathPattern="jwt-auth"
```

### Error "Cannot find module"
**Solución**: Reinstala dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Docker no funciona
**Solución**: Verifica que Docker esté corriendo:
```bash
docker --version
docker-compose --version
```

## 📚 Más Información

- **TESTING.md**: Guía completa de testing
- **TEST_SUMMARY.md**: Resumen de todos los tests creados
- **README.md**: Documentación principal del proyecto

---

**¡Listo para ejecutar! 🎉**
