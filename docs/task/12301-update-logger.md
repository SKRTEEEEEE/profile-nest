# Mejorar logger
## Objetivo
Crear la version definitiva del logger, en la que se configure mejor 'pino' para mostrar un poco mas de info cuando haya una acción, sin modificar el core de la app (osea las classes). Mejorar el logger para cuando este en producción, mantener un log de los .error de los ultimos 3 dias para ver posibles errores frecuentes y un contador de los errores del ultimo mes.

## Key points
- [ ] Mejorar configuración pino
- [ ] Mejorar/implementar guardado de logs local temporal
- [ ] Comprobar y refactorizar el uso de console por el uso del logger

## Ejemplo actual

```bash
OPERATION_SUCCESS
ENTITY_FOUND
ENTITY_FOUND
ENTITY_FOUND
ENTITY_FOUND
```

## Aclaración
Cuando hay un error se muestra buena info pero cuando por default es muy pobre y para los success apenas da información, por eso me gustaria modificar un poco la config ya que si no me equivoco ahora esta como que no muestra nada logger