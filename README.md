<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

# Profile Page NestJS Backend
<a href="https://profile-skrt.vercel.app/">
<div align="center">
  <img src="./docs/img/profile-page.gif"
       alt="banner" style="width: 100%"/>
</div>
</a>

## Información
Backend desarrollado con **Clean Architecture** para mi página de perfil.  
Construido con **NestJS** como framework principal.


### Utilidades nativas de NestJS
> Este backend busca **usar la menor cantidad de librerías externas posibles**, 
apoyándose en las utilidades nativas que ofrece **NestJS**.  
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
- ⬜ [Logging](https://docs.nestjs.com/techniques/logging)  
- ⬜ [Cookies](https://docs.nestjs.com/techniques/cookies)  


<b>🔒 Security</b>

- 🟧 [Authentication](https://docs.nestjs.com/security/authentication)  
- ✅ [Authorization](https://docs.nestjs.com/security/authorization)  
- 🟧 [Encryption & Hashing](https://docs.nestjs.com/security/encryption) 
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
