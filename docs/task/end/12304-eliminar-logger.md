# refactor(logger): replace custom pino logger with native NestJS logger. Closes #12304

## 📋 Resumen de Cambios

Se eliminó la implementación personalizada del logger basada en `nestjs-pino` con `rotating-file-stream` y se reemplazó con una implementación nativa de NestJS que mantiene las funcionalidades esenciales sin requerir permisos de escritura en el sistema de archivos.

## 🎯 Problema Resuelto

### Issue Original
El logger personalizado intentaba crear archivos de log en `/app/docs` en Railway, pero no tenía permisos de escritura, causando:
```
Error: EACCES: permission denied, mkdir '/app/docs'
```

### Causa Raíz
- `rotating-file-stream` requería crear directorios y archivos de logs
- Railway (y otros entornos de despliegue) tienen restricciones de permisos en el sistema de archivos
- La solución de guardar logs localmente no es la mejor práctica en despliegues cloud/contenedores

## ✅ Solución Implementada

### 1. Nuevo `NativeLoggerService`
**Archivo**: `src/shareds/presentation/native-logger.service.ts`

**Características**:
- ✅ **Logger Nativo**: Implementa `LoggerService` de NestJS sin dependencias externas
- ✅ **Correlation ID**: Mantiene soporte para correlation IDs en cada request
- ✅ **Formato Dual**:
  - **Development**: Logs coloridos y legibles para humanos con emojis
  - **Production**: Logs en formato JSON para agregación y análisis
- ✅ **Sin Archivos**: Todo se imprime a consola (stdout/stderr)
- ✅ **Niveles de Log**: log, error, warn, debug, verbose

**Formato de Desarrollo**:
```
20:45:32 ✅ [Context] Message (ID: abc12345...)
```

**Formato de Producción** (JSON):
```json
{
  "level": "log",
  "timestamp": "2025-10-30T20:45:32.123Z",
  "message": "Application started",
  "context": "NestApplication",
  "correlationId": "abc12345-6789-..."
}
```

### 2. CorrelationIdMiddleware Actualizado
**Archivo**: `src/shareds/presentation/correlation-id.middleware.ts`

**Cambios**:
- Ahora inyecta `NativeLoggerService`
- Establece el correlation ID en el logger para cada request
- Mantiene la funcionalidad de agregar el ID a headers de respuesta

### 3. Actualización de Archivos Dependientes

#### Archivos Modificados:
- ✅ `src/app.module.ts` - Reemplazado `LoggerModuleCustom` por `NativeLoggerService`
- ✅ `src/main.ts` - Actualizado para usar `NativeLoggerService`
- ✅ `src/shareds/presentation/filters/domain-error.filter.ts` - Adaptado a nueva API del logger
- ✅ `src/shareds/presentation/response.interceptor.ts` - Actualizado logger
- ✅ `src/modules/user/infrastructure/user.repo.ts` - Actualizado logger
- ✅ `src/modules/project/application/project.usecase.ts` - Actualizado logger

#### Archivos Eliminados:
- ❌ `src/shareds/presentation/logger.module.ts` (antiguo)
- ❌ `src/shareds/presentation/logger.service.ts` (antiguo)
- ❌ `src/shareds/presentation/logger-formatter.ts` (antiguo)

### 4. Dependencias Eliminadas

```json
// Eliminadas del package.json:
- nestjs-pino (^4.4.0)
- pino-http (^10.5.0)
- pino-multi-stream (^6.0.0)
- rotating-file-stream (^3.2.7)
```

**Beneficios**:
- 📦 ~13 paquetes menos en node_modules
- ⚡ Tiempo de instalación reducido
- 🔒 Menor superficie de ataque (menos dependencias)

### 5. Dockerfile Actualizado
**Archivo**: `Dockerfile`

**Cambios**:
```diff
- # Crea directorio de logs para rotación de archivos
- RUN mkdir -p /app/logs && chown -R node:node /app/logs
```

Ya no se necesita crear directorios de logs ni cambiar permisos.

### 6. Tests Actualizados

#### Nuevos Tests Creados:
- ✅ `test/units/native-logger.service.spec.ts` - Tests unitarios completos
- ✅ `test/e2e/native-logger.e2e-spec.ts` - Tests de integración end-to-end

#### Tests Actualizados:
- ✅ `test/units/correlation-id.middleware.spec.ts` - Adaptado a nueva dependencia
- ✅ `test/units/project/application/project.usecase.spec.ts` - Mock actualizado

**Cobertura de Tests**:
- ✅ Logging básico (log, error, warn, debug, verbose)
- ✅ Formato en desarrollo vs producción
- ✅ Manejo de correlation IDs
- ✅ Formato JSON en producción
- ✅ ANSI colors en desarrollo
- ✅ Manejo de objetos circulares
- ✅ Integración con middleware

## 🔍 Puntos Clave Mantenidos

### ✅ Correlation ID
- Cada request genera un UUID único
- Se propaga a través del logger
- Aparece en headers de respuesta: `X-Correlation-Id`
- Facilita tracing de requests en logs

### ✅ Funcionalidad de DomainError
- `createDomainError()` sigue funcionando igual
- El `DomainErrorFilter` registra errores correctamente
- Stack traces completos en logs de error

### ✅ Experiencia de Desarrollo
- Logs coloridos y legibles
- Emojis para identificar tipos de log
- Timestamps formateados
- Contexto claro de cada mensaje

### ✅ Producción
- Logs JSON estructurados
- Ideales para herramientas como:
  - Railway Logs
  - CloudWatch
  - Datadog
  - ELK Stack
  - Splunk

## 📊 Resultados

### Compilación
```bash
✅ npm run build - Success
✅ npm run lint - Success
✅ Eliminadas 4 dependencias problemáticas
✅ Dockerfile actualizado sin errores de permisos
```

### Tests
- ✅ Tests unitarios nuevos pasan
- ✅ Tests existentes actualizados y funcionando
- ✅ Integración con middleware verificada

### Despliegue
- ✅ No requiere permisos de escritura
- ✅ Compatible con Railway, Heroku, Docker, Kubernetes
- ✅ Logs van a stdout/stderr (best practice en containers)

## 🚀 Mejoras Adicionales

### Lo que se ganó:
1. **Simplicidad**: Menos dependencias, más mantenible
2. **Portabilidad**: Funciona en cualquier entorno sin configuración especial
3. **Cloud-Native**: Sigue best practices de logging en contenedores
4. **Rendimiento**: Menos overhead de librerías externas
5. **Debugging**: Logs más claros en desarrollo

### Lo que se mantuvo:
1. ✅ Correlation IDs
2. ✅ Contexto en logs
3. ✅ Stack traces en errores
4. ✅ Formato JSON en producción
5. ✅ Integración con DomainError

## 📝 Notas de Implementación

### Logging Best Practices Aplicadas:
1. **12-Factor App**: Logs a stdout/stderr
2. **Structured Logging**: JSON en producción
3. **Correlation IDs**: Para request tracing
4. **Contextual Logging**: Cada log tiene contexto claro
5. **Environment-Aware**: Diferente comportamiento por ambiente

### Consideraciones Futuras:
Si en el futuro se necesita persistencia de logs, considerar:
- **Servicios Externos**: Datadog, Loggly, Papertrail
- **Cloud Providers**: CloudWatch (AWS), Cloud Logging (GCP)
- **ELK Stack**: Elasticsearch + Logstash + Kibana
- **Loki**: Solución de Grafana Labs

❌ **Evitar**: Escribir archivos locales en contenedores/cloud deployments

## 🔧 Comandos de Verificación

```bash
# Compilar
npm run build

# Linting
npm run lint

# Tests
npm test

# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## 📚 Referencias

- [NestJS Logger Documentation](https://docs.nestjs.com/techniques/logger)
- [12-Factor App: Logs](https://12factor.net/logs)
- [Railway Logging Best Practices](https://docs.railway.app/reference/logs)

---

**Issue**: #12304  
**Fecha**: 2025-10-30  
**Agente**: Agent666  
**Estado**: ✅ Completado
