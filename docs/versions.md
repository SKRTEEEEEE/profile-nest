Probablemente mantendremos dos versiones de este proyecto

## Scripts de migración



### `npm run switch:main`
Configura el código actual para trabajar con package (rama `main`):
- HAY QUE PENSAR EN QUE PUNTO ACEPTA LOS CAMBIOS DE LA RAMA `latest`
1. **Verifica** que estés en rama `main` - Sino, `checkout main`
2. **Reemplaza** imports: `src/domain` → `@skrteeeeee/profile-domain`
3. **Valida/Mantiene** `package.json` -> ha de tener  `@skrteeeeee/profile-domain` como dependencia
4. **Valida/Mantiene** `Dockerfile` para 'main' prod y `Dockerfile.latest` para 'latest' prod (QA)
5. **Actualiza** `tsconfig.json` removiendo paths de submodule
6. **Borra** `dist` + `node_modules`
7. **Valida** configuración de tsconfig
8. **Instala** dependencias
9. **Ejecuta** `npx tsc --noEmit` para verificar tipos

### `npm run switch:latest` - TO REFACTOR (same as switch:main but reversal)
Configura el código actual para trabajar con submodule (rama `latest`):
1. **Verifica** que estés en rama `latest`
2. **Reemplaza** imports: `@skrteeeeee/profile-domain` → `src/domain`
3. **Actualiza** `tsconfig.json` con paths para submodule
4. **Valida** configuración de tsconfig
5. **Ejecuta** `npx tsc --noEmit` para verificar tipos


### `npm run latest-to-main` - TO CHECK (depends on switch:main)
**Script principal para promoción a producción.**
Automatiza completamente el merge de `latest` → `main`:

#### Errs on last script
```bash
adanr@Pc MINGW64 ~/code/profile-migr/profile-nest (main|MERGING)
$ npx tsc --noEmit
src/modules/pre-tech/application/pre-tech.interface.ts:3:29 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/entities/pre-tech' or its corresponding type declarations.

3 import { PreTechBase } from '@skrteeeeee/profile-domain/entities/pre-tech';
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/pre-tech/infrastructure/pre-tech.repo.ts:10:29 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/entities/pre-tech' or its corresponding type declarations.

10 import { PreTechBase } from '@skrteeeeee/profile-domain/entities/pre-tech';
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/pre-tech/infrastructure/pre-tech.schema.ts:3:29 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/entities/pre-tech' or its corresponding type declarations.

3 import { PreTechBase } from '@skrteeeeee/profile-domain/entities/pre-tech';
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/pre-tech/presentation/pre-tech.controller.ts:2:26 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/entities/role.type' or its corresponding type declarations.

2 import { RoleType } from '@skrteeeeee/profile-domain/entities/role.type';
                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/pre-tech/presentation/pre-tech.controller.ts:3:29 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/entities/pre-tech' or its corresponding type declarations.

3 import { PreTechBase } from '@skrteeeeee/profile-domain/entities/pre-tech';
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/pre-tech/presentation/pre-tech.dto.ts:6:29 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/entities/pre-tech' or its corresponding type declarations.

6 import { PreTechBase } from '@skrteeeeee/profile-domain/entities/pre-tech';
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/tech/infrastructure/tech-octokit/actualizar.repo.ts:6:29 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/entities/pre-tech' or its corresponding type declarations.

6 import { PreTechBase } from '@skrteeeeee/profile-domain/entities/pre-tech';
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/user/application/user-nodemailer.usecase.ts:9:48 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/flows/domain.error' or its corresponding type declarations.

9 import { DatabaseFindError, SetEnvError } from '@skrteeeeee/profile-domain/flows/domain.error';
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/user/application/user-nodemailer.usecase.ts:10:35 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/flows/error.registry' or its corresponding type declarations.

10 import { createDomainError } from '@skrteeeeee/profile-domain/flows/error.registry';
                                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/user/application/user-nodemailer.usecase.ts:11:28 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/flows/error.type' or its corresponding type declarations.

11 import { ErrorCodes } from '@skrteeeeee/profile-domain/flows/error.type';
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/user/application/user-nodemailer.usecase.ts:12:27 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/entities/user' or its corresponding type declarations.

12 import { UserFormS } from '@skrteeeeee/profile-domain/entities/user';
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/user/application/user.interface.ts:3:26 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/entities/user' or its corresponding type declarations.

3 import { UserBase } from "@skrteeeeee/profile-domain/entities/user";
                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/user/application/user.usecase.ts:9:26 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/entities/user' or its corresponding type declarations.

9 import { UserBase } from '@skrteeeeee/profile-domain/entities/user';
                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/user/domain/user-verification.ts:1:35 - error TS2307: Cannot find module 'src/domain/flows/error.registry' or its corresponding type declarations.

1 import { createDomainError } from "src/domain/flows/error.registry";
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/user/domain/user-verification.ts:2:28 - error TS2307: Cannot find module 'src/domain/flows/error.type' or its corresponding type declarations.

2 import { ErrorCodes } from "src/domain/flows/error.type";
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/user/domain/user-verification.ts:3:26 - error TS2307: Cannot find module 'src/domain/entities/user' or its corresponding type declarations.

3 import { UserBase } from "src/domain/entities/user";
                           ~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/user/infrastructure/user.repo.ts:14:37 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/entities/user' or its corresponding type declarations.

14 import { UserBase, UserFormS } from '@skrteeeeee/profile-domain/entities/user';
                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/modules/user/presentation/user.dto.ts:11:37 - error TS2307: Cannot find module '@skrteeeeee/profile-domain/entities/user' or its corresponding type declarations.

11 import { UserBase, UserFormS } from '@skrteeeeee/profile-domain/entities/user';
                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

test/units/domain/domain.error.spec.ts:11:8 - error TS2307: Cannot find module 'src/domain/flows/domain.error' or its corresponding type declarations.

11 } from 'src/domain/flows/domain.error';
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

test/units/domain/domain.error.spec.ts:12:28 - error TS2307: Cannot find module 'src/domain/flows/error.type' or its corresponding type declarations.

12 import { ErrorCodes } from 'src/domain/flows/error.type';
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
[...lot of lines of test errors, same as above]

Found 59 errors in 34 files.
```

### `npm run check:branch` - TO CHECK
Valida que la configuración actual coincida con la rama actual (sin hacer cambios).

### Flujo recomendado - TO CHECK

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