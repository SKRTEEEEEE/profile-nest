# Versiones

Mantendremos dos versiones 'oficiales' de este proyecto:
- `latest` - rama QA, para desarrollo, utiliza `domain` como submodule
- `main` - rama producción, utiliza `domain` como package (npm package)   

## Scripts de migración
1. **Verifica** que estés en rama X (ej: `main` o `latest`) - Sino, `checkout X`
2. **Reemplaza** imports: `src/domain` → `@skrteeeeee/profile-domain` si X es `main`
3. **Valida/Mantiene** `package.json` -> ha de tener  `@skrteeeeee/profile-domain` como dependencia si X es `main`
4. **Valida/Mantiene** `Dockerfile` para 'main' prod y `Dockerfile.latest` para 'latest' prod (QA)
5. **Actualiza** `tsconfig.json` removiendo paths de submodule si X es `main`
6. **Borra** `dist` + `node_modules`
7. **Valida** configuración de tsconfig
8. **Instala** dependencias
9. **Ejecuta** `npx tsc --noEmit` para verificar tipos
- Si X es `latest`, ejecuta el flujo al reves.
### Flujo recomendado 

#### Desarrollo normal en latest
```bash
git checkout latest
# ... desarrollas con submodule normalmente
git add . && git commit -m "feat: nueva funcionalidad"
```

#### Merge a producción (latest → main)
```bash
npm run latest-to-main
# El script automáticamente:
# - Hace checkout a main
# - Hace merge de latest
# - Convierte imports a package
# - Actualiza tsconfig.json
# - Valida con tsc --noEmit
# - Commitea los cambios
```

### `npm run latest-to-main` 
**Script principal para promoción a producción.**
Automatiza completamente el merge de `latest` → `main`:

### `npm run check:main` - TO CHECK
Configura el código actual para trabajar con package (rama `main`):

### `npm run check:latest` 
Configura el código actual para trabajar con submodule (rama `latest`):
1. **Verifica** que estés en rama `latest`
2. **Reemplaza** imports: `@skrteeeeee/profile-domain` → `src/domain`
3. **Actualiza** `tsconfig.json` con paths para submodule
4. **Valida** configuración de tsconfig
5. **Ejecuta** `npx tsc --noEmit` para verificar tipos

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