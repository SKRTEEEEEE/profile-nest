# Mejorar logger
## Objetivo
Acabar de mejorar el logger. 
No me acaba de gustar, cuando hay un error no se muestra el mensaje que es util para el desarrollador. (función de error creada)

También, en el formato para el developer, no me acaba de gustar el formato, yo prefería algo mas compacto como hace nestjs por defecto
    - Quizas para esto podriamos incluso hacer que de normal(development) se muestren los logs de nestjs y que pino se utilize solo para producción. Si esto es cambiar mucho la estructura podemos mantener pino, tu elijes que requiere menos configuración extra
## Aclaraciones
- Tienes un servidor de backend corriendo en el puerto :3001 y un servidor del codigo de ejemplo ../agora-next en :3002
- Antes de realizar un commit o de terminar la tarea, pide al usuario que compruebe si le gusta el nuevo formato

## Formato actual
```bash
 -
 -
 -
 -
NestFactory -
    context: "NestFactory"
InstanceLoader -
    context: "InstanceLoader"
InstanceLoader -
[100lines deleted-bcz are all the same]
RouterExplorer -
    context: "RouterExplorer"
NestApplication -
    context: "NestApplication"
 -
    req: {
      "method": "POST",
      "url": "/user",
      "userAgent": "node"
    }
    correlationId: "e7d60a11-262a-41ad-a8c7-4b5a22332951"
    res: {
      "statusCode": 201
    }
    responseTime: 381
 -
    req: {
      "method": "GET",
      "url": "/user/66cd92570f2d3a589e7fe1d2",
      "userAgent": "node"
    }
    correlationId: "8356f007-3bf0-42d1-b5cc-9d598ae61faf"
    res: {
      "statusCode": 200
    }
    responseTime: 204
 -
    req: {
      "method": "GET",
      "url": "/user/66cd92570f2d3a589e7fe1d2",
      "userAgent": "node"
    }
    correlationId: "934f69f5-625c-4644-8fe5-c4bafb5f07de"
    res: {
      "statusCode": 200
    }
    responseTime: 191
 -
    req: {
      "method": "GET",
      "url": "/user/66cd92570f2d3a589e7fe1d2",
      "userAgent": "node"
    }
    correlationId: "562ef160-9967-46dc-95b9-46c589b069bd"
    res: {
      "statusCode": 200
    }
    responseTime: 195

```