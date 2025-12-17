Probablemente mantendremos dos versiones de este proyecto
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