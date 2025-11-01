# docs(readme): add test coverage badges. Closes #3

## Resumen de cambios

### 📊 Coverage Badges Implementados

Se ha implementado un sistema automatizado de badges de cobertura de tests utilizando GitHub Actions y shields.io.

### Cambios realizados

#### 1. **Workflow de GitHub Actions** (`.github/workflows/node.yml`)

Se han añadido los siguientes steps al workflow:

- **Run tests with coverage**: Ejecuta `npm run test:cov` para generar el reporte de cobertura
- **Extract coverage metrics**: Extrae las métricas de coverage (statements, branches, functions, lines) del archivo `coverage-summary.json` generado por Jest
- **Create coverage badges**: Genera archivos JSON en `.github/badges/` siguiendo el formato de shields.io endpoint
  - `coverage-total.json`: Badge con cobertura total (promedio)
  - `coverage-statements.json`: Badge para statements
  - `coverage-branches.json`: Badge para branches  
  - `coverage-functions.json`: Badge para functions
  - `coverage-lines.json`: Badge para lines
- **Commit badge files**: Commitea automáticamente los archivos de badges cuando hay cambios (solo en rama main)
- **Push changes**: Pushea los cambios al repositorio con `[skip ci]` para evitar bucles infinitos

#### 2. **README.md**

Se ha añadido una nueva sección "Test Coverage" debajo del banner de la aplicación con 5 badges:

1. **Coverage Total**: Muestra el promedio de cobertura
2. **Coverage Statements**: Cobertura de sentencias
3. **Coverage Branches**: Cobertura de ramas condicionales
4. **Coverage Functions**: Cobertura de funciones
5. **Coverage Lines**: Cobertura de líneas

Los badges utilizan el endpoint de shields.io y apuntan a los archivos JSON generados en la rama main del repositorio.

#### Características de los badges

- **Colores dinámicos**: 
  - Verde (brightgreen): ≥ 80%
  - Amarillo (yellow): ≥ 60% y < 80%
  - Rojo (red): < 60%
- **Actualización automática**: Se actualizan en cada push a la rama main
- **Basados en umbral del proyecto**: El proyecto tiene configurado un threshold de 80% en todas las métricas

### Validaciones realizadas

✅ Tests unitarios ejecutados correctamente (100 tests passed)  
✅ Linting sin errores  
✅ Compilación TypeScript exitosa  
✅ Workflow YAML con sintaxis correcta

### Notas técnicas

- El sistema de badges utiliza el formato JSON endpoint de shields.io para máxima flexibilidad
- Los badges solo se actualizan en la rama `main` para evitar conflictos
- Se utiliza `[skip ci]` en el commit de badges para evitar triggers infinitos del workflow
- El workflow requiere permisos de escritura para pushear los badges (configurado con `GITHUB_TOKEN`)

### Corrección aplicada (Iteración 2)

Se detectó y corrigió un problema en la configuración de Jest que impedía la generación correcta del coverage:

**Problema:** 
- Coverage mostraba 0% en todas las métricas
- No se generaba el archivo `coverage-summary.json`
- El workflow fallaba al intentar extraer las métricas

**Solución aplicada en `jest.unit.config.ts`:**
1. Cambio de `rootDir: 'test/units'` a `rootDir: '.'`
2. Actualización de `testRegex` para incluir path completo
3. Corrección de `moduleNameMapper` para paths desde root
4. Actualización de paths en `collectCoverageFrom`
5. **Agregado explícito:** `coverageReporters: ['text', 'lcov', 'json-summary']`

Este último cambio es crítico ya que garantiza que Jest genere el archivo `coverage-summary.json` que el workflow necesita para crear los badges.

### Próximos pasos recomendados

Una vez mergeado a main, los badges se mostrarán correctamente. En el primer push a main después del merge:
1. El workflow generará los archivos JSON de badges
2. Los badges en el README mostrarán las métricas actuales de coverage
3. En cada push subsecuente, los badges se actualizarán automáticamente

### Archivos modificados

**Primera iteración:**
- `.github/workflows/node.yml` - Workflow con badges
- `README.md` - Badges añadidos

**Segunda iteración (corrección):**
- `jest.unit.config.ts` - Configuración de Jest corregida
