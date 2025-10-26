# Mejorar logger
## Objetivo
Mejorar el logger actual
## Key points
- [ ] Quitar estos cuatro campos: `"level":30,"time":1761510082982,"pid":13364,"hostname":"DESKTOP-98ULTRB",` que aparecen siempre, que no aparezcan nunca
- [ ] Mostrar cuando se este usando desarrollo (npm run ..dev) la salida de los logs mas bonita, incluyendo colores y una estructura 'logica' para que no haya tanto texto (parecido a como hace nestjs por defecto -.-)
- [ ] Configurar rotación de logs en producción
## Salida actual

```bash
{"level":30,"time":1761507687141,"pid":13364,"hostname":"DESKTOP-98ULTRB","context":"RouterExplorer","message":"Mapped {/project/:id, GET} route"}
{"level":30,"time":1761507687141,"pid":13364,"hostname":"DESKTOP-98ULTRB","context":"RouterExplorer","message":"Mapped {/project, POST} route"}
{"level":30,"time":1761507687141,"pid":13364,"hostname":"DESKTOP-98ULTRB","context":"NestApplication","message":"Nest application successfully started"}
{"level":30,"time":1761510082982,"pid":13364,"hostname":"DESKTOP-98ULTRB","req":{"method":"GET","url":"/pre-tech?q=hello","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"},"correlationId":"cd341fb1-ca78-42af-a4cd-cf1977166ae5","res":{"statusCode":200},"responseTime":270,"message":"GET /pre-tech?q=hello completed with status 200"}
```

## Salida esperada
```bash
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
```
### Pero siguiendo lo indicado en [./docs/policies.md](../policies.md) pero con mas información incluso 
Pero sin level, time, pid y hostname