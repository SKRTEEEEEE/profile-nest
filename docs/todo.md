# ToDo
## ThirdWeb
- [x] Desvincular tipos de modules/[..]/app - no pueden aver tipos de thirdWeb -> para eso:
  - [ ] ⁉️ Desvincular nodemailer
  - [x] Crear capa aplicación 🤔 -> No es necesario, ya que probablemente en cada app (diferentes server - frontend-info, frontend-app, backend) queremos expones mas o menos métodos, aparte que no tiene mucho sentido ya que los inputs (props) siempre dependen del sdk (infra)
  - [x] Esta parte es la única que sera común con el frontend ->  Vale la pena tener la app como submodule, o todo el 'shared/modulo' ❌
## Tech
### Desvincular 'actualizarGithub' de [actualizar.repo.ts](../src/modules/tech/infrastructure/tech-octokit/actualizar.repo.ts)
- [ ] Desvincular la lógica de octokit, creando una función genérica para actualizar.repo
  - [ ] Desvincular el tipo -> export enum ActualizarGithubType {"md", "json", "all"}
  - [ ] Crear enfoque ApiProperty (swagger/nest.js) para el tipo

## ERRORS
- [ ] Mejorar errors para manejar mensaje para el dev - vs - mensaje que se devuelve al final
- [ ] Ambos errores han de tener un formato bonito (emoji y formato reducido pero descriptivo) -> Incluir:
  - [ ] (dev) Localización del archivo (donde se ha llamado al error dentro del código) + ?linea del archivo?🤔
- [ ] Documentar-los muy bien el Swagger (solo es una vez :D)


## DTOs
- [x] Hacer DTOs
- [x] Utilizar los DTOs lo mas abajo posible (app si es posible) -> para ello, creo que lo mejor es utilizar-los en los casos en los se utiliza un shared (role-tech, user-thirdweb, etc..) pero ver que se necesita en Presentation y ver hasta que abajo (app-infra-presentation) 'tiene sentido' utilizar-lo para no duplicar 🤔 -> Prefiero no utilizar-lo en la capa app y respetar la norma de que solo la capa presentation contiene lógica del framework
- [x] Mirar en que capas quiero DTOs: controllers - se pueden reutilizar si tiene sentido en infra
- [x] Integrar buen funcionamiento
### Swagger
- [ ] Terminar de entender como funciona la personalización del documento -> [`dto-metadata.decorator.ts`](../src/shareds/swagger/dto-metadata.decorator.ts) | [`main.ts`](../src/main.ts)
- [ ] Desvincular configuración del [`main.ts`](../src/main.ts) 
#### ⚠️ Documentar ‼️🧠
## User
- [ ] Integrar ThirdWeb y DTOs correctamente
- [ ] Mejorar lógica backend - sobretodo funciones compartidas(user-role-thirdweb.usecase.ts, user-nodemailer.usecase)
  - [ ] Comprobar que campos son necesarios y cuales no
  - [ ] Fijarse en que algunos datos se pueden obtener del JWT -> como id del usuario que hace la acción
## Chart/Dynamic Banners
- [ ] Delete unused libraries -> `"canvas": "^3.1.0"` - `"chart.js": "^4.4.9"` - `"@types/chart.js": "^2.9.41"`
- [ ] Banner de tecnologías para el README - Esta parte HAY QUE devolverla en un endpoint para cuando la cambie se cambie en todos los README
### Añadir cache backend (CDN/generación semanal) i http, necesidad de registrar usuario, etc..
## Test
- [ ] Falta testear la parte de update-tech-octokit
- [x] Falta testear la parte del auth, conexion, nextjs - nestjs, mediante JWT
## Documentar
- [ ] Estructura nombres -> user-auth-mock, role-auth-token, ...
- [ ] Estructura carpetas
## Extra
- [ ] Crear 'warn' personalizado para notificar acciones y no utilizar nunca console.log y reservar el warn para warn reales (casos en los que se esta haciendo algo mal como programador pero que no causa error - normalmente porque ya esta manejado)
- [ ] Crear Inyector() para 'desvincular' de nestjs
- [ ] 🤔⁉️ Mejorar parte **techs** cambiar bdd para mejorar enfoque?
## Unificar tipos
- [x] Pensar una logica de tipos para las PROPS y las RES
    - Pensar a raíz de que punto crear el resto, pero utilizar una base y evitar duplicar tipos 

    -- por.ej -> Si utilizo -ReadProps, UpdateProps

    -> SOLO EXTENDER A PARTIR DE ESTOS TIPOS PASANDO-LE LOS GENÉRICOS
     
    -> ... Definir mas reglas para los tipos ...
- [x] Analizar la question de los dos tipos de implementación (en infra/mongoose/entities) -> <Entitie>Repository - (app/interface/entitie) - <entite>.interface.ts vs Mongoose<Pattern> - infra/types.patterns.d.ts
    - [x] Si dicha diferencia es inevitable (por los tipos dinámicos), en que punto debo pasar de una interfaz(tipos) a la otra.
        
        -> Yo creo que tiene que ser en la capa en question (en infra/mongoose/entities)
        
        -> Pero hay que analizar-lo bien y documentar-lo

        - Se pueden utilizar tipos distintos de entrada mientras estos no interfieran uno frente al otro (osea han de ser 'equivalentes', haciendo que uno sea mas pobre que el otro en tipado)
### Unificar Res y ERRORS v1 
- [x] Incluir siempre message y success

## Terminar tech-octokit/create.repo.ts
- [x] Hacer que saque lo necesario para actualizar.repo.ts


##### Prompt
mira chat, me gustaria explorar la parte de las secciones o diferentes implementaciones en swagger de nestjs, ya que yo tengo como dos apps distintas, una -mock, y otro -thirdweb, segun el jwt-auth enfoque se utilize, me gustaria configurarlo todo bien 