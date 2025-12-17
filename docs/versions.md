Probablemente mantendremos dos versiones de este proyecto

## Scripts de migración

### `npm run switch:latest`
Migra automáticamente a la rama `latest` (submodule):
1. **Checkout** a rama `latest`
2. **Reemplaza** imports: `@skrteeeeee/profile-domain` → `src/domain`
3. **Actualiza** `tsconfig.json` con paths para submodule
4. **Valida** configuración de tsconfig
5. **Ejecuta** `npx tsc --noEmit` para verificar tipos

### `npm run switch:main`
Migra automáticamente a la rama `main` (package):
1. **Checkout** a rama `main`
2. **Verifica** que domain tenga tag válido
3. **Reemplaza** imports: `src/domain` → `@skrteeeeee/profile-domain`
4. **Actualiza** `tsconfig.json` removiendo paths de submodule
5. **Valida** configuración de tsconfig
6. **Ejecuta** `npx tsc --noEmit` para verificar tipos

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