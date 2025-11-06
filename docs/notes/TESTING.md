# 🧪 Testing Guide - Profile NestJS Backend

## 📊 Test Coverage Overview

Este proyecto mantiene una **cobertura de código del 80% o superior** en todas las métricas:
- ✅ **Statements**: ≥ 80%
- ✅ **Branches**: ≥ 80%
- ✅ **Functions**: ≥ 80%
- ✅ **Lines**: ≥ 80%

Los badges de cobertura se actualizan automáticamente en cada push a la rama `main` mediante GitHub Actions.

## 🚀 Cómo Ejecutar los Tests

### Opción 1: Con npm (Local)

Requiere Node.js 22.5+ y las dependencias instaladas.

```bash
# Instalar dependencias (si no lo has hecho)
npm ci

# Ejecutar tests unitarios
npm run test

# Ejecutar tests con reporte de cobertura
npm run test:cov

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests en modo debug
npm run test:debug
```

### Opción 2: Con Docker 🐳 (Recomendado)

No requiere Node.js local, solo Docker y Docker Compose.

#### En Linux/Mac:
```bash
chmod +x scripts/run-tests-docker.sh
./scripts/run-tests-docker.sh
```

#### En Windows:
```bash
scripts\run-tests-docker.bat
```

#### Directamente con docker-compose:
```bash
# Construir imagen de tests
docker-compose -f docker-compose.test.yml build

# Ejecutar tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Limpiar contenedores
docker-compose -f docker-compose.test.yml down
```

## 📈 Ver Reportes de Cobertura

### Reporte en HTML

Después de ejecutar `npm run test:cov`, abre:
```
coverage/unit/lcov-report/index.html
```

### Reporte en Terminal

El reporte de cobertura se muestra automáticamente en la terminal después de ejecutar los tests con `test:cov`.

### Archivos de Cobertura

- **coverage/unit/lcov.info**: Formato LCOV para integraciones CI/CD
- **coverage/unit/coverage-summary.json**: Resumen en JSON con porcentajes
- **coverage/unit/lcov-report/**: Reportes HTML detallados

## 🏗️ Estructura de Tests

```
test/units/
├── app.module.spec.ts              # Tests del módulo principal
├── correlation-id.middleware.spec.ts
├── native-logger.service.spec.ts
├── simple.test.spec.ts
├── domain/                          # Tests de entidades de dominio
│   ├── domain.error.spec.ts
│   └── error.registry.spec.ts
├── shareds/                         # Tests de funcionalidades compartidas
│   ├── api-error.decorator.spec.ts
│   ├── api-success.decorator.spec.ts
│   ├── domain-error.filter.spec.ts
│   ├── global.validation.spec.ts
│   ├── jwt-auth.usecase.spec.ts
│   ├── jwt-auth-thirdweb.guard.spec.ts
│   ├── jwt-auth-thirdweb.strategy.spec.ts
│   ├── jwt-auth-mock.guard.spec.ts
│   ├── jwt-auth-mock.strategy.spec.ts
│   ├── octokit.service.spec.ts
│   ├── pattern-cru.impl.spec.ts
│   ├── pattern-populate.impl.spec.ts
│   ├── public-route.decorator.spec.ts
│   ├── response.interceptor.spec.ts
│   ├── role-auth.usecase.spec.ts
│   ├── role-auth-token.guard.spec.ts
│   ├── signature-auth-thirdweb.guard.spec.ts
│   ├── topic-calculator.usecase.spec.ts
│   └── topic-chart.usecase.spec.ts
├── user/                            # Tests del módulo User
│   ├── application/
│   │   ├── user.usecase.spec.ts
│   │   └── user-additional.usecase.spec.ts
│   ├── infrastructure/
│   │   └── user.repo.spec.ts
│   └── presentation/
│       └── user.controller.spec.ts
├── tech/                            # Tests del módulo Tech
│   ├── application/
│   │   ├── tech.usecase.spec.ts
│   │   ├── tech-read.usecase.spec.ts
│   │   └── tech-additional.usecase.spec.ts
│   ├── infrastructure/
│   │   └── tech.repo.spec.ts
│   └── presentation/
│       └── tech-additional.controller.spec.ts
├── project/                         # Tests del módulo Project
│   ├── application/
│   │   └── project.usecase.spec.ts
│   ├── infrastructure/
│   │   └── project.repo.spec.ts
│   └── presentation/
│       └── project.controller.spec.ts
├── role/                            # Tests del módulo Role
│   ├── application/
│   │   └── role.usecase.spec.ts
│   └── infrastructure/
│       └── role.repo.spec.ts
└── pre-tech/                        # Tests del módulo PreTech
    ├── application/
    │   └── pre-tech.usecase.spec.ts
    └── presentation/
        └── pre-tech.controller.spec.ts
```

## 🎯 Qué Archivos se Testean

### Incluidos en Cobertura:
- ✅ **Controllers**: Todos los controladores
- ✅ **Use Cases**: Lógica de aplicación
- ✅ **Repositories**: Implementaciones de repositorios
- ✅ **Guards**: Guards de autenticación y autorización
- ✅ **Interceptors**: Interceptores personalizados
- ✅ **Pipes**: Pipes de validación
- ✅ **Filters**: Exception filters
- ✅ **Services**: Servicios compartidos

### Excluidos de Cobertura:
- ❌ **DTOs**: `*.dto.ts`
- ❌ **Entities**: `*.entity.ts`
- ❌ **Interfaces**: `*.interface.ts`
- ❌ **Types**: `*.type.ts`, `*.types.ts`
- ❌ **Index files**: `index.ts`
- ❌ **Main**: `main.ts`

## 🔄 CI/CD - GitHub Actions

### Workflow Automático

El archivo `.github/workflows/node.yml` ejecuta automáticamente:

1. **En cada push**:
   - ✅ Checkout del código con submódulos
   - ✅ Setup de Node.js 22.5
   - ✅ Instalación de dependencias (con cache)
   - ✅ Build del proyecto TypeScript
   - ✅ Lint del código
   - ✅ Ejecución de tests con cobertura
   - ✅ Extracción de métricas de cobertura

2. **Solo en rama `main`**:
   - 🏅 Generación de badges de cobertura en formato shields.io
   - 💾 Commit automático de badges
   - 🚀 Push de cambios

### Badges de Cobertura

Los badges se generan automáticamente y se guardan en `.github/badges/`:
- `coverage-total.json` - Cobertura total promedio
- `coverage-statements.json` - Cobertura de statements
- `coverage-branches.json` - Cobertura de branches
- `coverage-functions.json` - Cobertura de funciones
- `coverage-lines.json` - Cobertura de líneas

Estos archivos se usan con shields.io endpoint badge:
```markdown
![Coverage Total](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/SKRTEEEEEE/profile-nest/main/.github/badges/coverage-total.json)
```

## 📝 Configuración de Jest

### jest.unit.config.ts

```typescript
{
  testRegex: 'test/units/.*\\.spec\\.ts$',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.entity.ts',
    '!src/**/*.type.ts',
    '!src/**/*.types.ts',
    '!src/**/index.ts',
    '!src/main.ts',
  ],
  coverageDirectory: 'coverage/unit',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

## 🐛 Troubleshooting

### Tests Fallan Localmente

1. **Verificar versión de Node.js**:
   ```bash
   node --version  # Debe ser 22.5+
   ```

2. **Reinstalar dependencias**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Limpiar cache de Jest**:
   ```bash
   npm run test -- --clearCache
   ```

### Tests Lentos

- Usar Docker para aislar el entorno
- Ejecutar tests en paralelo (Jest lo hace por defecto)
- Usar `test:watch` solo para archivos específicos

### Cobertura Baja

1. Revisar reporte HTML para identificar archivos sin cobertura
2. Crear tests para funciones/clases no cubiertas
3. Verificar que los archivos estén en `collectCoverageFrom`

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Shields.io Endpoint Badge](https://shields.io/endpoint)

## 🤝 Contribuir

Al agregar nuevas funcionalidades:

1. ✅ Escribir tests unitarios
2. ✅ Mantener cobertura ≥ 80%
3. ✅ Ejecutar `npm run test:cov` antes de commit
4. ✅ Verificar que los tests pasen en CI/CD
