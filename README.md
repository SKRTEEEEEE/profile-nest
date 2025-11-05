<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

# Profile Page NestJS Backend

<a href="https://profile-skrt.vercel.app/">
<div align="center">
  <img src="./docs/img/profile-page.gif"
       alt="banner" style="width: 100%"/>
</div>
</a>

<div align="center">

### Test Coverage

![Coverage Total](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/SKRTEEEEEE/profile-nest/main/.github/badges/coverage-total.json)
![Coverage Statements](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/SKRTEEEEEE/profile-nest/main/.github/badges/coverage-statements.json)
![Coverage Branches](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/SKRTEEEEEE/profile-nest/main/.github/badges/coverage-branches.json)
![Coverage Functions](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/SKRTEEEEEE/profile-nest/main/.github/badges/coverage-functions.json)
![Coverage Lines](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/SKRTEEEEEE/profile-nest/main/.github/badges/coverage-lines.json)

</div>

## Información

Backend desarrollado con **Clean Architecture** para mi página de perfil.  
Construido con **NestJS** como framework principal.

### Utilidades nativas de NestJS

> Este backend busca **usar la menor cantidad de librerías externas posibles**,
> apoyándose en las utilidades nativas que ofrece **NestJS**.  
> ✔️ Mantiene el **código ligero y sostenible**.  
> ✔️ Aprovecha al máximo la **filosofía modular de NestJS** (Programación Orientada a Objetos).  
> ✔️ Evita la sobrecarga innecesaria de dependencias.  
> ✔️ Minimiza la dependencia de librerías externas.

<details>
<summary><h4><pre>   👆 Utilidades nativas de NestJS **implementadas** 🖊️✅   </pre></h4></summary>
<b>📖 Overview</b>

- ✅ [Controllers](https://docs.nestjs.com/controllers)
- ✅ [Providers](https://docs.nestjs.com/providers)
- ✅ [Modules](https://docs.nestjs.com/modules)
- ✅ [Middleware](https://docs.nestjs.com/middleware)
- ✅ [Exception filters](https://docs.nestjs.com/exception-filters)
- ✅ [Pipes](https://docs.nestjs.com/pipes)
- ✅ [Guards](https://docs.nestjs.com/guards)
- ✅ [Interceptors](https://docs.nestjs.com/interceptors)
- ✅ [Custom decorators](https://docs.nestjs.com/custom-decorators)

<b>⚙️ Techniques</b>

- ✅ [Configuration](https://docs.nestjs.com/techniques/configuration)
- ✅ [Database](https://docs.nestjs.com/techniques/database)
- ✅ [Mongo](https://docs.nestjs.com/techniques/mongo)
- ✅ [Validation](https://docs.nestjs.com/techniques/validation)
- ✅ [Caching](https://docs.nestjs.com/techniques/caching)
- ⬜ [Serialization](https://docs.nestjs.com/techniques/serialization)
- ⬜ [Versioning](https://docs.nestjs.com/techniques/versioning)
- ⬜ [Task scheduling](https://docs.nestjs.com/techniques/task-scheduling)
- ⬜ [Queues](https://docs.nestjs.com/techniques/queues)
- 🟪 [Logging](https://docs.nestjs.com/techniques/logging)
- ⬜ [Cookies](https://docs.nestjs.com/techniques/cookies)

<b>🔒 Security</b>

- 🟪 [Authentication](https://docs.nestjs.com/security/authentication)
- ✅ [Authorization](https://docs.nestjs.com/security/authorization)
- 🟪 [Encryption & Hashing](https://docs.nestjs.com/security/encryption)
- ⬜ [CSRF Protection](https://docs.nestjs.com/security/csrf)
- ⬜ [Helmet](https://docs.nestjs.com/security/helmet)
- ⬜ [CORS](https://docs.nestjs.com/security/cors)
- ✅ [Rate Limiting](https://docs.nestjs.com/security/rate-limiting)

</details>

### Otras utilidades implementadas

#### 🌠 Clean Architecture

Arquitectura hexagonal version 'vertical' Clean, fuertemente desacoplada.

- [x] **Domain responsibility**: responsable de todas las implementaciones de la aplicación (diferentes clientes y servidor)
- [x] **Domain submodule**: implementado como sub módulo de Git

#### 🔏 Encrypted Jwt

#### 🔐 Signed By User & Encrypted Payload

#### 🧪 Dynamic Dev Deployment

Posibilidad de iniciar la aplicación como mock, en la cual el Jwt no va encriptado, facilitando el test.

## Tecnologías utilizadas

- [**NestJS**](https://nestjs.com/)
- [Docker](https://www.docker.com/)
- [Thirdweb](https://thirdweb.com/)
- [Nodemailer](https://nodemailer.com/)
- [Jest](https://jestjs.io/) - Testing framework
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/) con Mongoose

## 🧪 Testing

Este proyecto mantiene una cobertura de tests del **80%** o superior en todas las métricas (statements, branches, functions, lines).

### Ejecutar Tests Localmente

#### Con npm (requiere Node.js 22.5+)

```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:cov

# Tests en modo watch
npm run test:watch
```

#### Con Docker 🐳

```bash
# En Linux/Mac
./scripts/run-tests-docker.sh

# En Windows
scripts\run-tests-docker.bat

# O directamente con docker-compose
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### Ver Reporte de Cobertura

Después de ejecutar `npm run test:cov`, puedes ver el reporte detallado abriendo:
```
coverage/unit/lcov-report/index.html
```

### CI/CD

Los tests se ejecutan automáticamente en cada push mediante GitHub Actions. Los badges de cobertura se actualizan automáticamente en la rama `main`.

## Estructura de carpetas

La estructura sigue los principios de **Clean Architecture**, organizada por capas y responsabilidades:

- [src/`shareds`](./src/shareds/README.md)

  - _Funcionalidades compartidas o capa de presentación (frameworks)_
  - `presentation` -> Necesario para el fw
  - `...otras carpetas` -> Representa cada funcionalidad compartida

- [src/`modules`](./src/modules/README.md)

  - _Funcionalidades de la entidad_
  - `<entidad>`
    - `presentation`(./docs/presentation.md) → Controladores, DTOs, validaciones
    - `application`(./docs/application.md) → Casos de uso, lógica de aplicación
    - `infrastructure`(./docs/infrastructure.md) → Repositorios, servicios externos, persistencia

- [src/`domain`](https://github.com/SKRTEEEEEE/profile-domain)
  - _Entidades de dominio puras_

## [Recursos](https://github.com/SKRTEEEEEE/markdowns)

## Contacto

- 🌐 [Página web del desarrollador](https://profile-skrt.vercel.app)
- 📧 [Envíame un mensaje](mailto:adanreh.m@gmail.com)

## Contribuciones y Problemas

Si encuentras problemas o deseas contribuir al proyecto, por favor, crea un issue en el repositorio.

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
