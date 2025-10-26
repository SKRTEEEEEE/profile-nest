# feat(logger): Mejorar logger. Closes #12301

## Fecha de finalización
2025-10-26 

## Resumen de cambios

### 1. Configuración mejorada de Pino Logger

Se ha mejorado significativamente la configuración del logger `pino` en `logger.module.ts`:

- **autoLogging activado**: Ahora se registran automáticamente todas las peticiones HTTP
- **Mensajes personalizados**: Se agregaron `customSuccessMessage` y `customErrorMessage` para mostrar más información sobre cada request
- **Niveles de log personalizados**: Se implementó `customLogLevel` que categoriza los logs según el código de estado HTTP:
  - 4xx → warn
  - 5xx → error
  - 3xx y 2xx → info
- **Serializers mejorados**: Ahora se incluye información detallada de:
  - Request: método, URL, correlationId, user-agent
  - Response: statusCode
  - Error: tipo, mensaje, stack trace
- **Formato mejorado en desarrollo**: 
  - Fecha y hora completa (yyyy-mm-dd HH:MM:ss)
  - Multi-línea para mejor legibilidad
  - Formato de mensaje estructurado: `{levelLabel} - {context} - {msg}`

### 2. Servicio de Logger personalizado (CustomLoggerService)

Se creó un nuevo servicio `logger.service.ts` con funcionalidades avanzadas:

- **Guardado de logs de error en producción**:
  - Los errores se guardan en `logs/errors.log`
  - Se mantiene un contador diario en `logs/error-count.json`
- **Limpieza automática**:
  - Logs de error de más de 3 días se eliminan automáticamente
  - Contador de errores de más de 1 mes se limpia
- **Estadísticas de errores**: Método `getErrorStats()` que retorna:
  - Conteo diario de errores
  - Los últimos 100 errores registrados
- **Compatibilidad completa con NestJS**: Implementa la interfaz `NestLoggerService`

### 3. Refactorización de console.* por logger

Se eliminaron todos los usos de `console.log`, `console.warn`, `console.error` por el logger apropiado:

- **response.interceptor.ts**: Reemplazado `console.log` por `this.logger.debug`
- **user.repo.ts**: Reemplazado `console.error` por `this.logger.error`
- **project.usecase.ts**: Reemplazados `console.warn` por `this.logger.warn`
- **main.ts**: Reemplazados todos los `console.warn` por `logger.warn`

### 4. Tests implementados

Se crearon tests completos para garantizar la funcionalidad:

#### Tests unitarios:
- **logger.module.spec.ts**: Tests del módulo de logger
  - Verifica que el logger está definido
  - Prueba todos los métodos (log, error, warn, debug)
  - Verifica que los logs se ejecutan sin errores
  - Prueba logs con contexto y stack traces

- **correlation-id.middleware.spec.ts**: Tests del middleware de correlación
  - Verifica generación de correlation IDs únicos
  - Prueba que se agrega al request y response header
  - Verifica que se llama al siguiente middleware

#### Tests de integración (e2e):
- **logger.e2e-spec.ts**: Tests end-to-end del logger
  - Verifica que el correlation ID se incluye en headers
  - Prueba que diferentes requests tienen diferentes IDs
  - Verifica el logging de errores con contexto

### 5. Dockerignore mejorado

Se creó `.dockerignore` para optimizar la imagen Docker:
- Excluye `node_modules`, `logs`, `coverage`, etc.
- Reduce el tamaño de la imagen final
- Mejora los tiempos de build

## Impacto

### Beneficios principales:
1. **Mayor visibilidad**: Los logs ahora muestran información relevante en todos los casos (éxito y error)
2. **Trazabilidad mejorada**: Correlation IDs en todos los requests para seguimiento
3. **Mejor debugging**: Stack traces y contexto completo en errores
4. **Monitoreo de producción**: Logs persistentes y estadísticas de errores
5. **Código más limpio**: Sin uso de console.*, todo centralizado en el logger
6. **Testing robusto**: Cobertura completa con tests unitarios e integración

### Ejemplo de mejora:

**Antes:**
```bash
OPERATION_SUCCESS
ENTITY_FOUND
ENTITY_FOUND
```

**Después:**
```bash
[2025-10-26 18:30:15] INFO - UserController - GET /api/users/123 completed with status 200
[2025-10-26 18:30:16] INFO - ProjectController - GET /api/projects completed with status 200
[2025-10-26 18:30:17] WARN - ProjectReadByIdUseCase - Proyecto con id 456 no encontrado en la DB
```

## Tests ejecutados

✅ **Tests unitarios**: 27 tests pasados (5 suites)
- correlation-id.middleware.spec.ts: ✅
- logger.module.spec.ts: ✅
- project.usecase.spec.ts: ✅
- project.controller.spec.ts: ✅
- pre-tech.controller.spec.ts: ✅

✅ **Linting**: Sin errores
✅ **Type checking**: Sin errores

## Archivos modificados

### Nuevos archivos:
- `src/shareds/presentation/logger.service.ts`
- `test/units/logger.module.spec.ts`
- `test/units/correlation-id.middleware.spec.ts`
- `test/e2e/logger.e2e-spec.ts`
- `.dockerignore`
- `docs/task/end/12301-mejorar-logger.md`

### Archivos modificados:
- `src/shareds/presentation/logger.module.ts`
- `src/shareds/presentation/response.interceptor.ts`
- `src/modules/user/infrastructure/user.repo.ts`
- `src/modules/project/application/project.usecase.ts`
- `src/main.ts`
- `test/units/project/application/project.usecase.spec.ts`

## Notas técnicas

- El logger usa `pino` como motor subyacente por su alto rendimiento
- En desarrollo usa `pino-pretty` para formato legible y colorizado
- En producción los logs son JSON para mejor parseabilidad
- Los archivos de log se crean automáticamente en `./logs/`
- La limpieza de logs es automática al iniciar la aplicación

## Próximos pasos recomendados

1. Configurar rotación de logs con herramienta externa (logrotate)
2. Integrar con servicio de monitoreo (Datadog, Sentry, etc.)
3. Agregar endpoint de health check que incluya estadísticas de errores
4. Considerar agregar alertas cuando se supere un umbral de errores
