# 📋 App Policies
## ❌ Error
### 🚧 Estructura 'mensaje' errores
Estructura del mensaje del error
- (res): En caso de ser respuesta, sera la estructura del campo message
- (dev): En el caso de ser desarrollo, sera el console.error que se mostrara por consola
#### (dev) - general
- `[<logo-type> <type> -> <location>❔.<function>] <message>`
- _[🔐 UNAUTHORIZED ACTION -> MongooseUserRepo.delete] This is a example error_
#### (dev) - database
- `[<logo-type> <type> -> <location>❔.<function>] Db <action> ❔(for <entity>) <'template'-message>. ❔<optionalMessage>`
- _[🔐 UNAUTHORIZED ACTION -> MongooseUserRepo.readAll] Db readById (for User) is a example error_
#### (res) 
`<logo-type> <shortDesc-type>. <friendlyTip>`
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