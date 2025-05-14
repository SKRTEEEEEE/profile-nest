# Infrastructure
## GENERAL - all layers
- Las capas finales(mongoose/entities, shared) no necesitan usar services o nada parecido en el constructor, ya que utilizamos inyección (sino se crea un error de inyección circular)!!
## SHARED - **old services**
-> Aquí van los repositorios de los Shared, osea la implementación de cosas diferentes a las Entitie (email, storage, auth, etc...)


-> utilizaremos de naming -> <nombre-'shared'>.repo.ts

## ADAPTERS - **old connectors**
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

## MONGOOSE

### Implementations

  🧠 ⚠️ **Envolver todos los métodos con try-catch**

-> Estructura dinámica para crear repositorios de mongoose de entidades
