# Infrastructure
## Descripción

### 🐐 Importante
- Las capas finales(mongoose/entities, shared) no necesitan usar services o nada parecido en el constructor, ya que utilizamos inyección (sino se crea un error de inyección circular)!!
## SHARED - **old connector**

-> Aquí van los repositorios de los Shared, osea la implementación de cosas diferentes a las Entitie (email, storage, auth, etc...)


-> utilizaremos de naming -> <nombre-'shared'>.repo.ts
### SIEMPRE cuando necesitamos lógica de alguna 'librería' (servicio) diferente a bases de datos

## MONGOOSE

### IMPLEMENTATIONS

  🧠 ⚠️ **Envolver todos los métodos con try-catch**

-> Estructura dinámica para crear repositorios de mongoose de entidades
