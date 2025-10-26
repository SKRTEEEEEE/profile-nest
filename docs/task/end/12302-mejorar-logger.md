# feat(logger): Improve pino logger configuration and add log rotation. Closes #12302

## 📋 Resumen de cambios

Se ha mejorado significativamente la configuración del logger basado en Pino, implementando las mejoras solicitadas en el issue #12302.

## ✨ Cambios implementados

### 1. **Eliminación de campos innecesarios en logs**
   - ✅ Removidos los campos: `level`, `time`, `pid`, `hostname`
   - Configurado mediante `timestamp: false` y `base: null` en la configuración de Pino
   - Los logs ahora son más limpios y enfocados en el contenido relevante

### 2. **Mejora de visualización en desarrollo** ⭐ NEW
   - ✅ Implementado formato colorizado usando `pino-pretty`
   - ✅ **Logs HTTP unificados**: Un solo mensaje con status code y tiempo de respuesta
   - ✅ **Emojis contextuales**: Diferentes emojis según el contexto y status code
     - ✅ Success (2xx): emoji verde
     - ⚠️ Client error (4xx): emoji amarillo
     - ❌ Server error (5xx): emoji rojo
     - ⚡ Respuesta rápida (<500ms): emoji rayo
     - ⏱️ Respuesta media (500-1000ms): emoji reloj
     - 🐌 Respuesta lenta (>1000ms): emoji caracol
   - ✅ **Agrupación visual**: Logs repetitivos (InstanceLoader, RouterExplorer) indentados
   - ✅ **Filtrado de logs vacíos**: No se muestran logs sin información útil
   - ✅ Sin timestamp en desarrollo (se asume que es "ahora")

### 3. **Rotación de logs en producción**
   - ✅ Implementada rotación automática de archivos usando `rotating-file-stream`
   - ✅ Logs generales: rotación diaria, retención de 7 días, compresión gzip
   - ✅ Logs de errores: rotación diaria, retención de 30 días, compresión gzip
   - ✅ Dos streams separados para logs generales y errores
   - ✅ Limpieza automática de archivos antiguos

### 4. **Mejoras en el servicio de logger**
   - Simplificada la gestión de estadísticas de errores
   - Eliminada duplicación de logs (ahora `rotating-file-stream` maneja la persistencia)
   - Sistema de estadísticas diarias de errores mantenido en `error-stats.json`
   - Limpieza automática de estadísticas antiguas (> 30 días)

### 5. **Actualización de Dockerfile**
   - ✅ Creado directorio `/app/logs` para rotación de archivos
   - ✅ Configurados permisos apropiados para el usuario `node`
   - ✅ Añadido usuario no privilegiado para mayor seguridad

## 🧪 Tests

### Tests Unitarios
- ✅ Creado `test/units/logger.service.spec.ts` con cobertura completa
  - Tests para desarrollo y producción
  - Tests de estadísticas de errores
  - Tests de limpieza de estadísticas
  - Manejo de errores y casos edge

### Tests de Integración
- ✅ Creado `test/e2e/logger.e2e-spec.ts`
  - Tests end-to-end para ambientes desarrollo y producción
  - Validación de formato de logs
  - Verificación de rotación de archivos
  - Tests de estadísticas

### Actualización de Tests Existentes
- ✅ Actualizado `test/units/logger.module.spec.ts`

## 📦 Dependencias

Las siguientes dependencias ya estaban instaladas y se utilizan ahora correctamente:
- `nestjs-pino` - Integración de Pino con NestJS
- `pino-pretty` - Formateador bonito para desarrollo
- `rotating-file-stream` - Rotación de archivos de logs
- `pino-multi-stream` - Soporte para múltiples streams

## 🔧 Archivos modificados

### Código principal
- `src/shareds/presentation/logger.module.ts` - Configuración mejorada de Pino con detección de ambiente
- `src/shareds/presentation/logger.service.ts` - Simplificación del servicio

### 🎯 Detección de Ambiente

El logger ahora detecta automáticamente el ambiente de desarrollo en múltiples escenarios:

```typescript
const isDev =
  process.env.NODE_ENV === 'development' || 
  process.env.JWT_STRATEGY === 'mock' ||
  process.env.JWT_STRATEGY === 'd' ||
  !process.env.NODE_ENV; // Si NODE_ENV no está definido, asume desarrollo
```

**Funciona con:**
- ✅ `npm run start:dev` - NODE_ENV no definido
- ✅ `npm run start:dev-next` - JWT_STRATEGY='d'
- ✅ `npm run start:dev-mock` - JWT_STRATEGY='mock'
- ✅ Cualquier ambiente sin NODE_ENV definido (por defecto desarrollo)

**Producción requiere:**
- ⚠️ `NODE_ENV=production` explícitamente configurado

### Tests
- `test/units/logger.service.spec.ts` - **NUEVO** - Tests unitarios completos
- `test/e2e/logger.e2e-spec.ts` - **NUEVO** - Tests de integración
- `test/units/logger.module.spec.ts` - Actualizado

### Docker
- `Dockerfile` - Añadido soporte para logs en producción

## 📊 Resultados

### Antes (salida actual)
```bash
{"level":30,"time":1761507687141,"pid":13364,"hostname":"DESKTOP-98ULTRB","context":"RouterExplorer","message":"Mapped {/project/:id, GET} route"}
```

### Después (salida mejorada)

#### Desarrollo
```bash
[RouterExplorer] Mapped {/project/:id, GET} route
```

#### Producción (JSON sin campos innecesarios)
```json
{"context":"RouterExplorer","message":"Mapped {/project/:id, GET} route"}
```

## ✅ Validación

- [x] Todos los tests unitarios pasan (44 tests)
- [x] Linting sin errores
- [x] Build exitoso
- [x] Dockerfile actualizado con soporte de logs
- [x] Configuración de rotación de logs implementada

## 🎯 Objetivos cumplidos

- ✅ Campos innecesarios removidos (level, time, pid, hostname)
- ✅ Salida más bonita en desarrollo con colores
- ✅ Estructura lógica similar a NestJS por defecto
- ✅ Rotación de logs configurada en producción
- ✅ Tests completos implementados

## 🚀 Próximos pasos recomendados

1. Probar en ambiente de producción real
2. Verificar el rendimiento de la rotación de logs bajo carga
3. Considerar agregar más niveles de log según necesidades
4. Evaluar la integración con servicios de monitoreo externos (opcional)
