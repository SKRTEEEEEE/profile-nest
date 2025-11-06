# Reporte estructura
## Objetivo
Estudiar la estructura de el proyecto y mejorar la documentación
## Key points
### Documentación
- [ ] Crear NUEVO reporte sobre codigo y estructura actual: partes a refactorizar, codigo/clases inecesario, malas practicas en clean architecture, inyecciones/flujo clean arch incorrecto, etc.. TENIENDO EN CUENTA LA RESPUESTA A TU REPORTE ANTERIOR ./docs/
- [ ] Mejorar documentacion (./docs/application, ./docs/infrastructure, ./docs/policies, ./docs/presentation, ./docs/scrum, ./README.md) con información necesaria de cada caso sobre la estructura actual si lo consideras necesario, para ello, tendras que crear un nuevo documento <nombre_doc>.v2.md
### node.yml action
- Hay que mejorar la action, para ello te pasare un ejemplo de como que se muestren los badges y tu tienes que implementar-lo
- Ejemplo->
    ```md
    [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
    [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
    [![Thirdweb](https://img.shields.io/badge/Thirdweb-000000?style=for-the-badge&logo=thirdweb&logoColor=white)](https://thirdweb.com/)
    [![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
    [![MongoDB](https://img.shields.io/badge/MongoDB%20%2B%20Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
    [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

    ![Test Coverage](https://img.shields.io/badge/TEST-Coverage-green?style=social) [![Coverage: Statements](https://img.shields.io/badge/Statements-86.2%25-brightgreen?style=flat-square)](https://github.com/SKRTEEEEEE/profile-next) [![Coverage: Branches](https://img.shields.io/badge/Branches-50%25-red?style=flat-square)](https://github.com/SKRTEEEEEE/profile-next) [![Coverage:Functions](https://img.shields.io/badge/Functions-90%25-brightgreen?style=flat-square)](https://github.com/SKRTEEEEEE/profile-next) [![Coverage: Lines](https://img.shields.io/badge/Lines-92.3%25-brightgreen?style=flat-square)](https://github.com/SKRTEEEEEE/profile-next)
    ```

- Hemos de poner los test coverage despues del badge de License que habra en el header del README.md ppal
- El test coverage ha de tener el estilo que te he pasado todo en una linea
- Los colores de las partes(stmts, branches, etc..) han de depender del % de coverage, siendo verde superior a 80, naranja entre 40 y 80, y naranja oscuro entre 10 i 40 y rojo para menos de 10.
#### FIX: la action se aplica pero no se aplica el coverage real
- Fijate en como esta el README.md y mira el resultado de la action en github
```bash
PASS test/units/tech/application/tech-additional.usecase.spec.ts (14.118 s)
PASS test/units/tech/application/tech-read.usecase.spec.ts (14.238 s)
PASS test/units/user/application/user.usecase.spec.ts (14.39 s)
PASS test/units/domain/error.registry.spec.ts
PASS test/units/tech/application/tech.usecase.spec.ts
PASS test/units/native-logger.service.spec.ts
PASS test/units/project/application/project.usecase.spec.ts
PASS test/units/shareds/signature-auth-thirdweb.guard.spec.ts
PASS test/units/shareds/global.validation.spec.ts
PASS test/units/shareds/pattern-cru.impl.spec.ts
PASS test/units/shareds/jwt-auth-thirdweb.strategy.spec.ts
PASS test/units/pre-tech/application/pre-tech.usecase.spec.ts
PASS test/units/project/presentation/project.controller.spec.ts
PASS test/units/shareds/jwt-auth.usecase.spec.ts
PASS test/units/shareds/pattern-populate.impl.spec.ts
PASS test/units/correlation-id.middleware.spec.ts
PASS test/units/shareds/public-route.decorator.spec.ts
PASS test/units/shareds/jwt-auth-mock.guard.spec.ts
PASS test/units/simple.test.spec.ts
PASS test/units/pre-tech/presentation/pre-tech.controller.spec.ts
----------------------------------------------------|---------|----------|---------|---------|----------------------------
File                                                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s          
----------------------------------------------------|---------|----------|---------|---------|----------------------------
All files                                           |   32.89 |    40.04 |   37.18 |   32.83 |                
```
