# Swagger

## Enums

**Al utilizar-los como propiedad(Dto), utilizar `@ApiProperty(<apiYourEnumConfig>)`**

## Dto

Utilizar `@ApiDtoMetadata()`

## Guard

### jwt-auth.guard

**Utilizar `@ApiBearerAuth("access-token")`**

### Signature-auth.guard

Utilizar `@ApiSignAuthHeader()`

## Other

### Errors

Utilizar `@ApiErrorResponse()` -> - ["auto"] - puts all errors configured - ["get"] -> database_find - ["get"], "--protected" -> database_find + unauthorized_action - ["d"] (default) -> database_action + unauthorized_action

### Success

Utilizar `@ApiSuccessResponse()` -> 🚧📄

## -> 🧠 REMEMBER

### El tipo (en Dto) se infiere automáticamente

### ⁉️🤔 Mejor utilizar JSDocs ⁉️ -> para que infiera auto
