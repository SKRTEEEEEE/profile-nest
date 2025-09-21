# Presentation (NestJS)
## Description
Esta capa es la encargada de manejar todo lo externo, así como funciones propias del Framework. "Es la capa azul, que Uncle Bob define como **Frameworks & Drivers**". 

En Clean Architecture, esta capa es la más externa y está diseñada para interactuar con el mundo exterior. Su principal responsabilidad es:
- Manejar las peticiones HTTP y transformarlas en objetos del dominio
- Implementar la lógica específica del framework (NestJS en este caso)
- Proporcionar adaptadores para servicios externos
- Gestionar la serialización/deserialización de datos

Aunque la separación entre esta capa y la de `Infrastructure` es muy relativa. En mi caso me he basado en mantener aquí las classes más relativas a los endpoints o a la construcción de estos.
### Debe manejar toda la lógica proveniente del framework - NestJS
## CONTROLLERS
- Son los encargados de manejar los endpoints.
- También se crearán los métodos compuestos, exclusivos de la entidad, aquí.
### 🖊️ Controllers -> `<module>.controller.ts`
## PROVIDERS
Los Providers en NestJS son clases que pueden ser inyectadas en otras clases. En nuestra arquitectura, los utilizamos principalmente en las capas de `application -> use case` e `infrastructure -> repo`. Aunque otros patrones como `strategy` y muchos mas también lo són.

### 🤔 (SERVICES) - USE CASES *
Los Use Cases (conocido como Services) son la implementación de la lógica de negocio. En esta implementación:
- Implementan interfaces específicas (ej: `ReadOneI`, `UpdateI`, `DeleteI`)
- Son genéricos para permitir flexibilidad con diferentes tipos de datos
- Ejemplo: `TechCreateUseCase`, `TechReadByIdUseCase`

### 🤔 (REPOSITORIES) - REPO
Los Repositories son responsables de la persistencia de datos:
- Extienden patrones base (ej: `MongooseCRRUUDidPattern`)
- Implementan interfaces específicas de persistencia
- Manejan la conexión con la base de datos
- Ejemplo: `MongooseUserRepo`

### 🤔 (CONNECTION MANAGER) - CONN
Las Connections son responsables de:
- Inicializar conexiones con servicios externos
- Manejar la configuración de estos servicios
- Proporcionar instancias configuradas
- Ejemplo: `OctokitConfig`

### 🤔 HELPERS
Clases de utilidad que proporcionan funcionalidades comunes.

### STRATEGY
El **patrón Strategy** es un patrón de diseño de comportamiento que permite definir una familia de algoritmos, encapsular cada uno de ellos y hacerlos intercambiables. Su propósito es permitir que el algoritmo varíe independientemente de los clientes que lo utilizan.

#### 🔍 ¿Qué problema resuelve?

Cuando tienes múltiples formas de realizar una tarea (como diferentes formas de autenticar a un usuario, ordenar datos, calcular descuentos, etc.), y no quieres llenar tu código de `if`/`switch`, el patrón Strategy te permite delegar esa lógica en clases separadas y seleccionarlas dinámicamente.



#### 🧱 Estructura básica

* **Context**: el objeto que usa una estrategia.
* **Strategy (interfaz)**: declara una interfaz común para todas las estrategias concretas.
* **Concrete Strategies**: implementan distintas variantes del algoritmo.



### * Utilizado en la capas de `application` y `infrastructure`
- En este caso, comúnmente son las clases que se utilizan en app e infra y son inyectables.
- Se utiliza en dichas capas (app e infra) pero solo el decorador `@Injectable()` de NestJS. 
- Para desvincular estos repositorios del Framework, podemos crear un decorador de ts personalizado que en esta parte de la aplicación (NestJS) utilice el `@Injectable()` de NestJS.


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

### 🖊️ Modules -> `<module>.module.ts`

## MIDDLEWARE
## FILTERS
- Filtros utilizados para definir el comportamiento de la aplicación, muy parecido a Guards

### 🖊️ Filter -> `<module>.filter.ts`
## PIPES
### VALIDATION
- Encargados de manejar validaciones automáticaticas
#### 🖊️ Validation -> `<module>.validation.ts`

### DTOs

Los DTOs (Data Transfer Objects) son objetos que definen cómo se transmiten los datos entre diferentes capas de la aplicación. En NestJS, son fundamentales para:

- Validación de datos de entrada
- Documentación de la API (especialmente con Swagger)
- Transformación de datos
- Seguridad (evitar exponer datos sensibles)

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

#### 🖊️ Dto -> `<module>.dto.ts`
## GUARDS
### Implementa `CanActivate` - `AuthGuard` - etc..
### 🛡️ ¿Cuándo usar un `Guard`?

Los Guards en NestJS son **middleware de autorización** que se ejecutan antes de que una ruta sea manejada por un controlador. Su ciclo de vida es:

1. Se ejecutan después de los middleware globales
2. Antes de los interceptores
3. Antes de los pipes
4. Antes de llegar al controlador

Usas un **guard** en NestJS cuando necesitas **controlar el acceso** a rutas o recursos antes de que el request llegue al controlador.

#### ✅ Casos típicos para guards:

* Autenticación (JWT, API key, OAuth, etc.)
* Autorización (comprobación de roles, permisos)
* Filtros de requests no válidos
* Validación de tokens o credenciales
* Control de acceso basado en IP o geolocalización

#### ❌ No usar un guard para:

* Llamar APIs externas (GitHub, Stripe)
* Enviar correos
* Subir archivos
* Lógica de negocio (eso va en casos de uso o services del core)
* Transformación de datos (usar pipes para esto)
* Logging (usar interceptores para esto)

---

### 🧩 ¿Cuándo usar un `Adapter`?

En Clean Architecture, un **adapter** es un envoltorio que implementa una interfaz del core, pero conecta con servicios externos (APIs, SDKs, infraestructura).

#### ✅ Casos típicos para adapters:

* Enviar email → usa `NodemailerAdapter` que implementa `EmailSender`
* GitHub → usa `GitHubAdapter` que implementa `IGitHubClient`
* Stripe → usa `StripeAdapter` que implementa `IPaymentProcessor`
* UploadThing → usa `StorageAdapter` que implementa `IFileUploader` o `IStorageService`

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
### 🖊️ Guards -> `<module>.guard.ts`

## INTERCEPTORS
### 📃 Implementa `NestInterceptor`

Los Interceptors son una característica poderosa de NestJS que permite:
- Transformar los datos de entrada/salida
- Extender el comportamiento básico de una función
- Transformar excepciones
- Agregar lógica extra antes/después de la ejecución de un método
- Completamente anular la ejecución de una función

### Casos de Uso Comunes:

1. **Logging**:
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.debug(`${method} ${url} ${Date.now() - now}ms`);
      }),
    );
  }
}
```

2. **Transformación de Respuestas**:
```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

3. **Cache**:
```typescript
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = request.url;
    
    // Implementar lógica de cache
    return next.handle();
  }
}
```

### 🖊️ Interceptor -> `<module>.interceptor.ts`
## DECORATORS

### 🖊️ Decorator -> `<module>.decorator.ts`



## ‼️ NOT USED RN ➡️ ADAPTERS - **part of old infra/service (w. guard)**
### Son parte de PROVIDERS
-> Son los encargados de 'adaptar' la lógica de la infraestructura

    🤖 Adaptadores: Los adaptadores (o "adapters") que se utilizan para interactuar con servicios externos, bases de datos, o cualquier otra infraestructura deberían estar en la capa de infraestructura. Esto incluye adaptadores para APIs externas, bases de datos, etc. Su función es traducir las llamadas de la capa de aplicación a las interfaces específicas de la infraestructura.

- Actualmente no dispongo de ningún adapter, aunque lo mas parecido sería los archivos `.conn` ⁉️
- Puedes encontrar mas info en [¿Que es un adapter?](#-cuándo-usar-un-adapter)

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


