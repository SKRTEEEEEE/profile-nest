# Shared

## Descripción
La capa de Shared contiene funcionalidades compartidas que no están directamente relacionadas con las entidades del dominio y su flujo posible dentro del lenguaje. Esto significa que Shared contiene:
- Todas las funcionalidades necesarias para la aplicación que necesitan funcionalidad aportada por tecnologías externas al lenguaje utilizado, en este caso Typescript, 
- Todas las funcionalidades aportadas por el lenguaje, que necesiten ser utilizadas en varios módulos.

Cada funcionalidad compartida se organiza como un módulo independiente que contiene sus propias capas (app-infra-presentation) según necesidad. - Cuando la funcionalidad no necesite infraestructura (funciones aportadas por otros servicios) no se le aplicara. 
- Como forma opcional, se podrá evitar la capa aplicación cuando se quiera utilizar funciones externas sin modificar (SDK, etc..), o cuando se considere que no aporta valor añadirla.

> **Objetivo:** Centralizar y desacoplar todas las dependencias y utilidades transversales para facilitar la reutilización, el mantenimiento y la escalabilidad del proyecto.

## Estructura de `Módulos shared`

```
shared/
├── octokit/                 # Módulo para integración con GitHub
│   ├── application/        # Casos de uso y lógica de negocio
│   ├── infrastructure/     # Implementaciones concretas
│   └── presentation/       # Adaptadores y controladores
│
├── thirdweb/               # Módulo para integración con ThirdWeb
│   ├── infrastructure/
│   └── presentation/
│
├── role-auth/             # Módulo para gestión de roles y autenticación
│   ├── application/
│   └── presentation/
│
└── [otro-modulo]/         # Otros módulos compartidos según necesidad
```

### Ejemplos de `Módulos raíz shared`

#### 1. Módulos de Integración Externa
- **Octokit**: Integración con GitHub
- **ThirdWeb**: Integración con servicios Web3
- **Stripe**: Integración con pagos
- **Nodemailer**: Servicios de email
- **Cloud Storage**: Almacenaje distribuido de archivos

#### 2. Módulos del Autenticación y Autorización
- **Role-Auth**: Gestión de roles y permisos
- **JWT**: Manejo de tokens
- **OAuth**: Autenticación con proveedores externos

#### 3. Módulos de Utilidad
- **Storage**: Gestión de archivos
- **Logger**: Sistema de logging
- **Cache**: Gestión de caché

## Estructura por Capas (Clean Architecture) para `Módulos raíz shared` 

> **Nota:** No todos los módulos(shared) requieren las tres capas. Evalúa la necesidad según el caso de uso.
> 
> Shared que simplemente su objetivo es compartirse entre módulos de entidad, pero no necesita implementaciones externas (infrastructure)
>  
> -> Se recomienda **NO usar capa INFRASTRUCTURE**
> - [Puedes ver un ejemplo de como en `role-auth`](./role-auth/)
> 
> Shared que simplemente utiliza las funciones de servicios externos, sin modificaciones 
> 
> -> Se recomienda **NO usar capa APPLICATION**
> - [Puedes ver un ejemplo de como en `thirdweb`](./thirdweb/)
> - Nos interesa crear UseCase cuando vayamos a tener varias implementaciones -> [`jwt-auth`](./jwt-auth/) 
> - _?o cuando se vaya a modificar mucho el comportamiento nativo externo_ ⁉️
> - Puedes crear interfaces y implementar-las (sin necesidad de UseCase) -> [`octokit`](./octokit/)

### Application
- UseCase: Contiene los casos de uso específicos del módulo 
- Interface: Define las interfaces que deben implementar los servicios


### Infrastructure
- Repo: Implementa las interfaces definidas en la capa de aplicación
- Conn: Contiene la lógica de conexión con servicios externos
- [OTROS ⚠️🚧 -- todo](../../docs/infrastructure.md): Muchos mas patrones de clase


### Presentation 
- Modules: Organize the application structure into scopes.
- Controller: Inbound HTTP Requests and produces HTTP Responses.
- DTO: Limita/controla las entradas. *_Puede configurar-se en otras capas_ 
- [OTROS](../../docs/presentation.md): Muchos mas patrones de clase con la implementación del Framework utilizado, NestJs

## Convenciones de Nomenclatura Base

### Módulo raíz
- Nombre descriptivo de la funcionalidad: `octokit`, `thirdweb`, `role-auth`

### Estructura interna Capas Clean Architecture

- Evitar nombres genéricos para patrones, como `utils` o **`repository`**

#### Application
- Interfaces: `<nombre>.interface.ts`
- UseCases: `<nombre>.usecase.ts`
#### Infrastructure
- Repo: `<nombre>.repo.ts`
- Conn: `<nombre>.conn.ts`

#### Presentation
- DTOs: `<nombre>.dto.ts`
- Controladores: `<nombre>.controller.ts`
- Modules: `<nombre>.module.ts`

## `Módulos shared 'especiales'`
Nos referimos a patrones de clase no tan comunes o exclusivos de esta aplicación.
### PATTERN
Modulo Patrón para 'normalizar' el acceso a distintas bases de datos. Inspirado en los métodos de mongoose.
