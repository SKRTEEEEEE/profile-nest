# Test de Logs en Producción

## Configuración Verificada ✅

### 1. **Timestamp en Producción**
```typescript
timestamp: isDev ? () => `,"time":"${new Date().toISOString()}"` : true
```
- ✅ Development: Formato custom para pino-pretty
- ✅ Production: `true` = timestamp estándar de pino (JSON)

### 2. **Serializers Detallados para Producción**

#### Request Serializer:
En producción incluye:
- `id`: Request ID
- `method`: HTTP method
- `url`: Full URL
- `query`: Query parameters
- `params`: Route parameters
- `headers`: Selected headers (host, user-agent, content-type)
- `remoteAddress`: Client IP
- `correlationId`: Tracking ID

#### Response Serializer:
En producción incluye:
- `statusCode`: HTTP status
- `headers`: Response headers (content-type, content-length)

#### Error Serializer:
Siempre incluye:
- `type`: Error type
- `message`: Error message
- `stack`: Full stack trace (en producción también!)
- `code`: Error code (si existe)
- `errno`: Error number (si existe)

### 3. **Rotación de Archivos**
```typescript
// Logs generales
const generalStream = createStream('application.log', {
  interval: '1d',     // Rotación diaria
  maxFiles: 7,        // Mantiene 7 días
  path: 'docs/logs',
  compress: 'gzip',   // Comprime archivos antiguos
});

// Logs de errores
const errorStream = createStream('error.log', {
  interval: '1d',     // Rotación diaria
  maxFiles: 30,       // Mantiene 30 días (más tiempo para errores)
  path: 'docs/logs',
  compress: 'gzip',
});
```

### 4. **Multi-stream**
```typescript
multistream([
  { stream: generalStream, level: 'info' },   // Todo nivel info+
  { stream: errorStream, level: 'error' },    // Solo errores
]);
```

## Cómo Probar

### Opción 1: Variable de Entorno
```bash
# Windows PowerShell
$env:NODE_ENV="production"; npm start

# Windows CMD
set NODE_ENV=production && npm start

# Linux/Mac
NODE_ENV=production npm start
```

### Opción 2: Crear script en package.json
```json
{
  "scripts": {
    "start:prod-test": "cross-env NODE_ENV=production nest start"
  }
}
```

## Formato Esperado en Producción

### Archivo: `docs/logs/application.log`
```json
{"level":30,"time":1698765432000,"message":"✅ POST   /user → 201 +381ms","req":{"id":"req-123","method":"POST","url":"/user","query":{},"params":{},"headers":{"host":"localhost:3001","user-agent":"Mozilla/5.0","content-type":"application/json"},"remoteAddress":"::1","correlationId":"e7d60a11-262a-41ad-a8c7-4b5a22332951"},"res":{"statusCode":201,"headers":{"content-type":"application/json","content-length":"156"}},"responseTime":381}
```

### Archivo: `docs/logs/error.log`
```json
{"level":50,"time":1698765433000,"message":"❌ POST   /user/error → 500 +234ms - Internal Server Error","req":{"id":"req-124","method":"POST","url":"/user/error","query":{},"params":{},"headers":{"host":"localhost:3001","user-agent":"Mozilla/5.0","content-type":"application/json"},"remoteAddress":"::1","correlationId":"abc-123"},"res":{"statusCode":500},"err":{"type":"DATABASE_ACTION","message":"Connection failed","stack":"Error: Connection failed\n    at UserService.create (/app/src/user.service.ts:45:11)\n    ...","code":"ECONNREFUSED"},"responseTime":234}
```

## Verificación

1. **Iniciar en modo producción**
2. **Hacer algunas requests** (exitosas y con errores)
3. **Verificar archivos en `docs/logs/`:**
   ```bash
   ls docs/logs/
   # Deberías ver:
   # - application.log
   # - error.log
   ```
4. **Ver contenido:**
   ```bash
   # Ver últimas líneas de logs generales
   tail -n 5 docs/logs/application.log
   
   # Ver últimas líneas de logs de errores
   tail -n 5 docs/logs/error.log
   ```
5. **Verificar que es JSON válido:**
   ```bash
   # Formatear JSON para ver estructura
   cat docs/logs/application.log | tail -n 1 | python -m json.tool
   ```

## Diferencias Desarrollo vs Producción

| Aspecto | Desarrollo | Producción |
|---------|-----------|------------|
| **Formato** | Texto coloreado (pino-pretty) | JSON estructurado |
| **Destino** | Console (stdout) | Archivos rotados |
| **Timestamp** | `HH:MM:ss` | Epoch milisegundos |
| **Request Details** | Mínimos (method, url) | Completos (headers, IP, query, params) |
| **Response Details** | Básicos (statusCode) | Detallados (headers) |
| **Stack Traces** | Mostrados en console | Guardados en archivo |
| **Rotación** | No aplica | Diaria con compresión |
| **Retención** | No aplica | 7 días general, 30 días errores |

## Estructura de Directorio de Logs

```
docs/logs/
├── application.log              # Log actual
├── application-2025-10-28.log.gz  # Rotado y comprimido
├── application-2025-10-27.log.gz
├── ...
├── error.log                    # Errores actuales
├── error-2025-10-28.log.gz      # Errores rotados
└── ...
```

## Confirmación ✅

- ✅ Logs en formato JSON raw en producción
- ✅ Rotación diaria configurada
- ✅ Compresión gzip activada
- ✅ Retención: 7 días (general), 30 días (errores)
- ✅ Multi-stream: archivo separado para errores
- ✅ Timestamp correcto en producción (`true`)
- ✅ Serializers detallados para producción
- ✅ Stack traces incluidos en todos los entornos
- ✅ Pretty print solo en desarrollo
- ✅ Estructura JSON completa con correlationId, request details, etc.
