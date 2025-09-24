# Presentation (NestJS)

## Descripción

Capa encargada de manejar todo lo externo y funciones propias de NestJS. Aquí se concentran las clases relativas a los endpoints o a la construcción de estos.
Responsabilidades principales:

- Manejar peticiones HTTP y transformarlas en objetos del dominio
- Implementar la lógica específica del framework
- Proporcionar adaptadores para servicios externos
- Gestionar la serialización/deserialización de datos

## Controllers

- Manejan los endpoints
- Aquí se definen métodos compuestos exclusivos de cada entidad
- Archivo: `<module>.controller.ts`

## Modules

- Definen los providers y su configuración (`useClass` / `useFactory`)
- Archivo: `<module>.module.ts`

## Middleware

- Lógica de middleware propio de la app

## Filters

- Definen el comportamiento frente a excepciones
- Archivo: `<module>.filter.ts`

## Pipes

### Validation

- Encargados de manejar validaciones automáticas
- Archivo: `<module>.validation.ts`

### DTOs

- Objetos para transferencia de datos
- Usados para validación, transformación y seguridad
- Archivo: `<module>.dto.ts`

## Guards

- Implementan `CanActivate`
- Controlan acceso a rutas o recursos antes del controlador
- Archivo: `<module>.guard.ts`
  Casos en esta app:
- Auth (JWT / mock): con `Guard`
- Email, GitHub, Stripe, UploadThing: mediante **Adapters** en infraestructura

## Interceptors

- Transforman datos de entrada/salida
- Agregan lógica extra antes/después de métodos
- Ejemplos: logging, transformación de respuestas, cache
- Archivo: `<module>.interceptor.ts`

## Decorators

- Decoradores propios
- Archivo: `<module>.decorator.ts`

## Adapters (No usados actualmente en esta capa)

- Viven en infraestructura y adaptan la lógica para interactuar con servicios externos (APIs, DB, etc.)
- En este proyecto lo más parecido son los `.conn`
