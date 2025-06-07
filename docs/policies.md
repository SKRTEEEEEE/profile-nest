# 📋 App Policies
## ❌ Error
### 🚧 Estructura 'mensaje' errores
Estructura del mensaje del error
- (res): En caso de ser respuesta, sera la estructura del campo message
- (dev): En el caso de ser desarrollo, sera el console.error que se mostrara por consola
#### (dev) - general
- `[-type> <type> -> <location>❔.<function>] <message>`
- _[🔐 UNAUTHORIZED ACTION -> MongooseUserRepo.delete] This is a example error_
#### (dev) - database
- `[-type> <type> -> <location>❔.<function>] Db <action> ❔(for <entity>) <'template'-message>. ❔<optionalMessage>`
- _[🔐 UNAUTHORIZED ACTION -> MongooseUserRepo.readAll] Db readById (for User) is a example error_
#### (res) 
`-type> <shortDesc-type>. <friendlyTip>`
#### 🛠️ Reglas de Uso
* 🧠 Los errores de **Database** tienen que tener **action**
### 🪵 Jerarquía de Mensajes de Consola
#### 🎯 Objetivo

Establecer buenas prácticas para el uso de mensajes de consola (`console.*`) que ayuden al desarrollo, mantenimiento y depuración, sin generar ruido innecesario en entornos de producción.

#### 💹 Tabla
Se utilizará una jerarquía que indique **la importancia** y **el ciclo de vida** (o vida útil - tiempo que se planea mantener-lo, en el código) del mensaje en el código:

| Nivel          | Método de consola                               | Propósito                                                                                                       | Vida útil esperada                                            |
| -------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 🔴 Error       | `console.error`                                 | Fallos críticos en lógica o servicios externos. Ideal para visibilidad inmediata.                               | Permanente                                                    |
| 🟡 Advertencia | `console.warn`                                  | Algo no crítico pero inesperado (e.g. parámetros vacíos, datos incompletos). Requiere atención pero no bloquea. | Permanente                                                    |
| 🔵 Info        | `console.info`                                  | Mensajes de estado generales, como "servidor iniciado", "usuario conectado", etc.                               | Permanente o medio plazo                                      |
| 🧪 Debug       | `console.debug`                                 | Información útil durante el desarrollo o depuración local.                                                      | Temporal (debe ser eliminado o comentado antes de producción) |
| 🔍 Inspección  | `console.dir`, `console.table`, `console.trace` | Para análisis profundo o estructurado de objetos complejos, trazas o visualización tabular.                     | Temporal (debe ser eliminado o comentado antes de producción) |
| 🪐 Log         | `console.log`                                   | Información temporal para el desarrollo o depuración local.                                                     | Temporal (**debe ser eliminado al terminar de usarlo**)       |


#### 🛠️ Reglas de Uso

##### General
* 🔒 **Nada de `console.log` sueltos en el código.**
* ⏳ **Comenta** mensajes de tipo debug (**`console.debug`** - .dir, etc..) antes de mergear a `main` o `release`.
* ✅ Usa `console.debug` comentado cuando quieras mantener un temporal (`.log`).
* ✅ `console.info` para mensajes informativos duraderos.
* ⏱ Usa `console.time`/`console.timeEnd` solo para pruebas de rendimiento temporales.

##### Clean Architecture
* 🧠 Todos los `console.error` deben ser gestionados exclusivamente por las clases o módulos responsables del manejo de errores.
* ❌ Nada de `console.error` disperso en el código.
* ✅ Solo se aceptan `console.error` dentro de clases o funciones dedicadas al filtrado y propagación de errores, como `domain-error.filter.ts` 
* ⁉️ (?o flujos definidos dentro de domain/flows??).

## 🏗️ Build NestJs 
Información sobre como aprovechar la estrategia desarrollada para aprovechar al máximo NestJs y la Onion Architecture.
### 🔄 Workflow
#### Endpoints
##### Decoradores
Deberá contener los siguientes decoradores:
> Base
> - 🔑 **Endpoint**: Método http, proporcionado por NestJs -> `@Delete("/:nameId")`

> Privada/Publica Auth
> - 🚦 **PublicRoute**: Si la ruta es publica, se deberá indicar con el decorador personalizado -> `@PublicRoute()`
> - ⚙️ **ApiBearerAuth**: Si la ruta no es publica, se utiliza el decorador personalizado, indicando a Swagger que BearerAuth se deberá utilizar. Actualmente admite solo 'access-token' -> `@ApiBearerAuth("access-token")`

> Other Auth
> - 🚦 **UseGuards**: Si la ruta es privada y require auth extra, como 'RoleAuth' o 'WalletSignatureAuth', se indica con el decorador de NestJs -> `@UseGuards(SignatureAuthThirdWebGuard)`

> Role Auth
> - 🚦 **UseGuards** -> `@UseGuards(RoleAuthTokenGuard)`
> - 🚦 **Roles**: Si la ruta requiere autentificación de Role, se indica utilizando el decorador personalizado Roles pasando-le el **role mínimo requerido** -> `@Roles(RoleType.ADMIN)`

> Wallet Signature Auth
> - 🚦 **UseGuards** -> `@UseGuards(SignatureAuthThirdWebGuard)`
> - ⚙️ **ApiSignAuthHeader**: Si la ruta requiere autentificación de Wallet Signature, se utiliza el decorador personalizado, indicando a Swagger que se necesitara la firma de la wallet en el campo header -> `@ApiSignAuthHeader()`
>
> 🏗️⚠️ _Esta parte esta por definir mejor_

> Params
> - ⚙️ **ApiParam**: Si la ruta requiere params, y estos **utilizan enum** (siempre que tengan un numero finito de posibilidades), se indica con el decorador de NestJs. -> `@ApiParam({name: "type", enum: ActualizarGithubParams})`
>
> ⚙️🧠 _Para el Enum, en este caso, no es necesario hacer 'apiEnum' ya que este no se mostrara en schemas de swagger_

> Base Swagger
> - ⚙️ **ApiErrorResponse**:
> - ⚙️ **ApiSuccessResponse**:
> - ⚙️ **ApiOperation**:

### 🛠️ Techniques / Recipes / Strategies
#### NestJs Features
##### ✅ [Open api](https://docs.nestjs.com/openapi/introduction)
##### ❎ [Microservices](https://docs.nestjs.com/microservices/basics)
##### ❎ [Websockets](https://docs.nestjs.com/websockets/gateways)
##### ❎ [GraphQL](https://docs.nestjs.com/graphql/quick-start)
##### ✅ Recipes
- [x] [Mongoose](https://docs.nestjs.com/recipes/mongodb)
- [x] [Swagger](https://docs.nestjs.com/openapi/introduction)
- [ ] [...]
##### ✅ Techniques 
- [x] [Configuration](https://docs.nestjs.com/techniques/configuration)
- [x] [Mongo](https://docs.nestjs.com/techniques/mongodb)
- [x] [Validation](https://docs.nestjs.com/techniques/validation)

<details>
<summary>[...]</summary>

- [ ] [Database](https://docs.nestjs.com/techniques/database)
- [ ] [Caching](https://docs.nestjs.com/techniques/caching)
- [ ] [Serialization](https://docs.nestjs.com/techniques/serialization)
- [ ] [Versioning](https://docs.nestjs.com/techniques/versioning)
- [ ] [Task Scheduling](https://docs.nestjs.com/techniques/task-scheduling)
- [ ] [Queues](https://docs.nestjs.com/techniques/queues)
- [ ] [Logging](https://docs.nestjs.com/techniques/logger)
- [ ] [Cookies](https://docs.nestjs.com/techniques/cookies)
- [ ] [Events](https://docs.nestjs.com/techniques/events)
- [ ] [Compression](https://docs.nestjs.com/techniques/compression)
- [ ] [File Upload](https://docs.nestjs.com/techniques/file-upload)
- [ ] [Streaming Files](https://docs.nestjs.com/techniques/streaming-files)
- [ ] [HTTP Module](https://docs.nestjs.com/techniques/http-module)
- [ ] [Session](https://docs.nestjs.com/techniques/session)
- [ ] [MVC](https://docs.nestjs.com/techniques/mvc)
- [ ] [Performance (Fastify)](https://docs.nestjs.com/techniques/performance)
- [ ] [Server-Sent Events](https://docs.nestjs.com/techniques/server-sent-events)
</details>

#### Other Features
##### 🌠 Onion Architecture
Arquitectura hexagonal version Onion, fuertemente desacoplada.
- [x] **Domain responsibility**: responsable de todas las implementaciones de la aplicación (diferentes clientes y servidor)
- [x] **Domain submodule**: implementado como sub módulo de Git
##### 🔏 Encrypted Jwt
##### 🔐 Signed Encrypted Payload
##### 🧪 Dynamic Dev Deployment
Posibilidad de iniciar la aplicación como mock, en la cual el Jwt no va encriptado, facilitando el test.


## 📄 Docs
### Emojis
#### Swagger
#### Markdowns
##### [Build NestJs/Workflow -> decoradores](#-workflow)
- 🔑 para required -> representa algo que se debe utilizar si o si
- 🚦 para solo si es necesario, pero de uso imprescindible
- ⚙️ para solo si es necesario, pero de uso prescindible -> prescindible pero útil para un uso perfecto