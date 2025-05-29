# Swagger
## Enums
**Al utilizar-los como propiedad(Dto), utilizar `@ApiProperty(<apiYourEnumConfig>)`**

## Dto
Utilizar `@ApiDtoMetadata()`
## Guard
### jwt-auth.guard
**Utilizar `@ApiBearerAuth("access-token")`**
### Signature-auth.guard
Utilizar `@ApiHeader()`
#### ⚠️🧠 Que hacer para el enfoque dinámico con signature.auth
- ⚠️ Tambien con el guard
- 🤔 Ideal -> (1.) Cuando se pone el guard, se configura el ApiHeader automáticamente. (2.) Cuando se utiliza mock, se anula (1) 
## Errors
Utilizar `@ApiErrorResponse()` -> "auto" - puts all errors configured
## -> 🧠 REMEMBER
### El tipo (en Dto) se infiere automáticamente
### ⁉️🤔 Mejor utilizar JSDocs ⁉️ -> para que infiera auto