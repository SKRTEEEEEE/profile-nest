# Presentation
## Description
Esta capa es la encargada de manejar todo lo externo, asi como funciones propias del Framework. "Es la capa azul, que Uncle Bob define como **Frameworks & Drivers**". 

Aunque la separación entre esta capa y la de `Infrastructure` es muy relativa. En mi caso me he basado en mantener aquí las classes mas relativas a los endpoints o a la construcción de estos.
### Debe manejar toda la lógica proveniente del framework - NestJS
## GUARDS
### 🛡️ ¿Cuándo usar un `Guard`?

Usas un **guard** en NestJS cuando necesitas **controlar el acceso** a rutas o recursos antes de que el request llegue al controlador.

#### ✅ Casos típicos para guards:

* Autenticación (JWT, API key, OAuth, etc.)
* Autorización (comprobación de roles, permisos)
* Filtros de requests no válidos

#### ❌ No usar un guard para:

* Llamar APIs externas (GitHub, Stripe)
* Enviar correos
* Subir archivos
* Lógica de negocio (eso va en casos de uso o services del core)

---

### 🧩 ¿Cuándo usar un `Adapter`?

En Clean Architecture, un **adapter** es un envoltorio que implementa una interfaz del core, pero conecta con servicios externos (APIs, SDKs, infraestructura).

#### ✅ Casos típicos para adapters:

* Enviar email → usa `NodemailerAdapter` que implementa `EmailSender`
* GitHub → usa `GitHubAdapter` que implementa `GitHubActions`
* Stripe → usa `StripeAdapter` que implementa `PaymentProcessor`
* UploadThing → usa `StorageAdapter` que implementa `FileStorage`

Esto permite que tu dominio (casos de uso y core) sea agnóstico de la tecnología.

---

### ⚙️ Resumen según casos de esta aplicación

| Funcionalidad         | Guard | Adapter  | Comentario                                                                                           |
| --------------------- | ----- | -------- | ---------------------------------------------------------------------------------------------------- |
| Auth (JWT / mock)     | ✅     | Opcional | `Guard` para controlar acceso. El adapter es útil si abstraes auth externa (ej. FirebaseAuthAdapter) |
| Email (Nodemailer)    | ❌     | ✅        | `EmailSenderAdapter` que implementa `IEmailSender`                                                   |
| GitHub (Octokit)      | ❌     | ✅        | `GitHubAdapter` que implementa `IGitHubClient`                                                       |
| Stripe (Auth & pagos) | ❌     | ✅        | `StripeAdapter` que implementa `IPaymentProcessor`                                                   |
| UploadThing (storage) | ❌     | ✅        | `StorageAdapter` que implementa `IFileUploader` o `IStorageService`                                  |

## FILTERS

## CONTROLLERS

## DECORATORS

## ADAPTERS - **part of old infra/service (w. guard)**
-> Son los encargados de 'adaptar' la lógica de la infraestructura

    🤖 Adaptadores: Los adaptadores (o "adapters") que se utilizan para interactuar con servicios externos, bases de datos, o cualquier otra infraestructura deberían estar en la capa de infraestructura. Esto incluye adaptadores para APIs externas, bases de datos, etc. Su función es traducir las llamadas de la capa de aplicación a las interfaces específicas de la infraestructura.

### Adapter is a service (service vs adapter)


#### 🧠 Resumen claro:

| Concepto              | ¿Qué es?                                     | ¿Para qué sirve?                                             | Ejemplo                                               |
| --------------------- | -------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| `Strategy` (Passport) | Clase de autenticación plugable              | Para validar tokens, headers, etc. (se usa con guards)       | `JwtStrategy`, `GoogleStrategy`, `MockAuthStrategy`   |
| `Guard`               | Middleware de autorización                   | Bloquear o permitir acceso a rutas                           | `JwtAuthGuard`, `RolesGuard`                          |
| `Adapter`             | Clase que implementa una interfaz del core   | Para conectar con servicios externos, sin acoplar el dominio | `NodemailerAdapter`, `StripeAdapter`, `GithubAdapter` |
| `Service`             | Clase de lógica de negocio o infraestructura | Puede ser cualquier cosa, a menudo usada directamente        | `UserService`, `EmailService`, etc.                   |

---

#### 🧩 ¿Por qué le llamamos Adapter si es un Service?

Es simplemente por **convención en Clean Architecture**:

* Un adapter es **un tipo de servicio**.
* La diferencia clave es que un adapter **implementa una interfaz del core** y **vive en la infraestructura**.
* Así puedes tener múltiples implementaciones, por ejemplo:

  * `ConsoleEmailSenderAdapter` para testing
  * `NodemailerEmailSenderAdapter` en producción
  * `SESAdapter` si usas AWS

Esto te permite hacer `useClass` dinámico, o incluso cambiar de proveedor sin tocar el dominio.

## MODULES
### Providers
#### `useFactory` vs `useClass` 

Ambos enfoques (`useFactory` y `useClass`) son formas de registrar proveedores en NestJS, pero tienen diferencias clave en cómo se utilizan y cuándo son más apropiados.
- (Actualmente): Podemos decir que en nuestro ejemplo en [pre-tech](./modules/pre-tech.module.ts) si inyectamos el Repo(infra), utilizo useFactory, sino queremos inyectar los Service(app) utilizo

##### **`useClass`**
- Registra una clase como implementación de una interfaz o token.
- Úsalo cuando tienes una implementación concreta que no necesita lógica adicional para inicializarse.
- Ventajas:
  - Más limpio y directo.
  - Ideal para casos donde no necesitas lógica personalizada.
- Desventajas:
  - Menos flexible si necesitas lógica adicional para inicializar el proveedor.

##### **`useFactory`**
- Permite crear manualmente una instancia de un proveedor utilizando una función de fábrica.
- Úsalo cuando necesitas lógica personalizada o inicialización compleja.
- Ventajas:
  - Más flexible, ya que puedes agregar lógica personalizada.
  - Útil para inicializaciones dinámicas o dependencias complejas.
- Desventajas:
  - Más verboso y requiere más configuración.

##### **Comparación**

| **Aspecto**                  | **`useClass`**                                      | **`useFactory`**                                   |
|------------------------------|-----------------------------------------------------|----------------------------------------------------|
| **Configuración**            | Más sencilla: NestJS resuelve automáticamente.      | Más personalizada: tú controlas la inicialización. |
| **Flexibilidad**             | Menos flexible: siempre usa la misma implementación.| Más flexible: puedes agregar lógica adicional.      |
| **Reutilización**            | Ideal para implementaciones genéricas y reutilizables.| Mejor para casos específicos o personalizados.    |
| **Código**                   | Más limpio y conciso.                               | Más verboso, pero más controlado.                  |

##### **¿Cuál usar?**
- **`useClass`**: Úsalo cuando tengas una implementación concreta que no necesite lógica adicional.
- **`useFactory`**: Úsalo cuando necesites lógica personalizada o inicialización dinámica.

En general, `useClass` es más común y adecuado para la mayoría de los casos, mientras que `useFactory` es útil para escenarios más complejos o específicos.

## PIPES
### DTOs


#### ✅ Extender DTOs

Supongamos que quieres extender `QueryDto` para un caso donde también necesitas paginación:

```ts
export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
```

Puedes extenderlos así:

```ts
export class SearchWithPaginationDto extends QueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
```

Y ahora puedes usarlo en tu controlador:

```ts
@Get()
async search(@Query() query: SearchWithPaginationDto) {
  // query.q, query.page, query.limit disponibles
}
```

---

#### 🧠 Composición con `@IntersectionType`

NestJS + `@nestjs/mapped-types` (o `@nestjs/swagger`) también permite **componer DTOs** usando helpers como `IntersectionType`, `PartialType`, etc.

```ts
import { IntersectionType } from '@nestjs/mapped-types';

export class SearchWithPaginationDto extends IntersectionType(QueryDto, PaginationDto) {}
```

Esto te da más flexibilidad si trabajas con muchos DTOs reusables.

