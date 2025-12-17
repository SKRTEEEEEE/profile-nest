Probablemente mantendremos dos versiones de este proyecto

## Scripts de migración

### Flujo recomendado

#### Desarrollo normal en latest
```bash
git checkout latest
# ... desarrollas con submodule normalmente
git add . && git commit -m "feat: nueva funcionalidad"
```

#### Merge a producción (latest → main)
```bash
git checkout main
npm run latest-to-main
# El script automáticamente:
# - Hace merge de latest
# - Convierte imports a package
# - Actualiza tsconfig.json
# - Valida con tsc --noEmit
# - Commitea los cambios

# Luego solo necesitas:
git rm -r src/domain
npm install @skrteeeeee/profile-domain@latest
git add . && git commit -m "chore: remove submodule"
git push origin main
```

### `npm run switch:latest`
Configura el código actual para trabajar con submodule (rama `latest`):
1. **Verifica** que estés en rama `latest`
2. **Reemplaza** imports: `@skrteeeeee/profile-domain` → `src/domain`
3. **Actualiza** `tsconfig.json` con paths para submodule
4. **Valida** configuración de tsconfig
5. **Ejecuta** `npx tsc --noEmit` para verificar tipos

### `npm run switch:main`
Configura el código actual para trabajar con package (rama `main`):
1. **Verifica** que estés en rama `main`
2. **Reemplaza** imports: `src/domain` → `@skrteeeeee/profile-domain`
3. **Actualiza** `tsconfig.json` removiendo paths de submodule
4. **Valida** configuración de tsconfig
5. **Ejecuta** `npx tsc --noEmit` para verificar tipos

### `npm run latest-to-main`
**Script principal para promoción a producción.**
Automatiza completamente el merge de `latest` → `main`:
1. **Verifica** que estés en rama `main` y sin cambios pendientes
2. **Mergea** rama `latest` usando estrategia `theirs` (evita conflictos)
3. **Convierte** imports: `src/domain` → `@skrteeeeee/profile-domain`
4. **Actualiza** `tsconfig.json` removiendo paths de submodule
5. **Valida** con `npx tsc --noEmit`
6. **Commitea** automáticamente el merge

### `npm run check:branch`
Valida que la configuración actual coincida con la rama actual (sin hacer cambios).

## Dev
- **Con despliegue** en: https://profile-nest-production.up.railway.app/api
  - Sirve como 'rama QA'
- **`domain` como submodule**
  - *Esto facilita el desarrollo al ver los cambios y 'obligar' a crear un `tag` antes de aplicar en frontend*
- Estará en la **rama `latest`**
  - **CI/CD main** en esta rama: Requiere configurar submodule

### Imports
- **Utiliza `src/domain`**
## Prod
- **Con despliegue** en: https://kind-creation-production.up.railway.app/api
  - Se debe configurar NPM_TOKEN en despliegue: utilizando Dockerfile
- **`domain` como package:** @skrteeeeee/profile-domain
- Estará en la **rama `main`**
  - **SIN CI/CD** en esta rama
### Imports
- **Utiliza `@skrteeeeee/profile-domain`**