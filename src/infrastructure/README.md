# Infrastructure
## SHARED - **old services**
-> Aquí van los repositorios de los Shared, osea la implementación de cosas diferentes a las Entitie (email, storage, auth, etc...)


-> utilizaremos de naming -> <nombre-'shared'>.repo.ts

## ADAPTERS - **old connectors**
-> Son los encargados de 'adaptar' la lógica de la infraestructura

    🤖 Adaptadores: Los adaptadores (o "adapters") que se utilizan para interactuar con servicios externos, bases de datos, o cualquier otra infraestructura deberían estar en la capa de infraestructura. Esto incluye adaptadores para APIs externas, bases de datos, etc. Su función es traducir las llamadas de la capa de aplicación a las interfaces específicas de la infraestructura.

## MONGOOSE

-> Estructura dinámica para crear repositorios de mongoose de entidades
