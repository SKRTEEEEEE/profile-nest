# Fix: Eliminar logger
## Objetivo
Eliminar logger y volver al logger nativo de nest-js manteniendo el enfoque de solo llamar a createDomainError(), manteniendo Correlation-Id y otras cosas útiles en despliegue.
## Explicación
He intentado instalar pino pero no me acaba de gustar, aparte el objetivo ppal era tener un guardado de logs en local pero esto me esta dando muchos errores
## Key points
- [ ] Mantener las funcionalidades actuales, como correlationId
- [ ] Si es posible configurar que ciertos errores se guarden en algún archivo, pero para esto hemos de pensar como railway gestiona esto, ya que es un despliegue real. Quizás es mejor practica usar bdd, o nose como se hace de normal
## Issue en railway actual
```
You reached the start of the range
Oct 30, 2025, 6:56 PM
Starting Container
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
Node.js v22.21.1
node:events:497
      throw er; // Unhandled 'error' event
    at async /app/node_modules/rotating-file-stream/dist/cjs/index.js:51:17
      ^
Emitted 'error' event on RotatingFileStream instance at:
Error: EACCES: permission denied, mkdir '/app/docs'
    at async mkdir (node:internal/fs/promises:860:10)
    at async RotatingFileStream.reopen (/app/node_modules/rotating-file-stream/dist/cjs/index.js:148:13)
    at emitErrorNT (node:internal/streams/destroy:170:8)
  code: 'EACCES',
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
  syscall: 'mkdir',
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
  path: '/app/docs'
  errno: -13,
}
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
  path: '/app/docs'
}
Node.js v22.21.1
node:events:497
      throw er; // Unhandled 'error' event
      ^
Error: EACCES: permission denied, mkdir '/app/docs'
    at async mkdir (node:internal/fs/promises:860:10)
    at async RotatingFileStream.reopen (/app/node_modules/rotating-file-stream/dist/cjs/index.js:148:13)
    at async /app/node_modules/rotating-file-stream/dist/cjs/index.js:51:17
Emitted 'error' event on RotatingFileStream instance at:
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
  errno: -13,
  code: 'EACCES',
  syscall: 'mkdir',
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
Node.js v22.21.1
    at async mkdir (node:internal/fs/promises:860:10)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
    at async RotatingFileStream.reopen (/app/node_modules/rotating-file-stream/dist/cjs/index.js:148:13)
  errno: -13,
  path: '/app/docs'
    at async /app/node_modules/rotating-file-stream/dist/cjs/index.js:51:17
  code: 'EACCES',
}
Emitted 'error' event on RotatingFileStream instance at:
  syscall: 'mkdir',
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
node:events:497
      throw er; // Unhandled 'error' event
      ^
Error: EACCES: permission denied, mkdir '/app/docs'
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
node:events:497
      throw er; // Unhandled 'error' event
      ^
Error: EACCES: permission denied, mkdir '/app/docs'
    at async mkdir (node:internal/fs/promises:860:10)
    at async RotatingFileStream.reopen (/app/node_modules/rotating-file-stream/dist/cjs/index.js:148:13)
    at async /app/node_modules/rotating-file-stream/dist/cjs/index.js:51:17
Emitted 'error' event on RotatingFileStream instance at:
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
  errno: -13,
  code: 'EACCES',
  syscall: 'mkdir',
  path: '/app/docs'
}
Node.js v22.21.1
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse
node:events:497
      throw er; // Unhandled 'error' event
      ^
Error: EACCES: permission denied, mkdir '/app/docs'
    at async mkdir (node:internal/fs/promises:860:10)
    at async RotatingFileStream.reopen (/app/node_modules/rotating-file-stream/dist/cjs/index.js:148:13)
    at async /app/node_modules/rotating-file-stream/dist/cjs/index.js:51:17
Emitted 'error' event on RotatingFileStream instance at:
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
  errno: -13,
  code: 'EACCES',
  syscall: 'mkdir',
  path: '/app/docs'
}
```