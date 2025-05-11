# Presentation
## Description
Esta capa es la encargada de manejar todo lo externo, asi como funciones propias del Framework. "Es la capa azul, que Uncle Bob define como **Frameworks & Drivers**". 

Aunque la separación entre esta capa y la de `Infrastructure` es muy relativa. En mi caso me he basado en mantener aquí las classes mas relativas a los endpoints o a la construcción de estos.
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
