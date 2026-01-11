# Reporte de Error en el Sistema de Login

## Problema Identificado

El sistema de login fallaba al intentar autenticar nuevos usuarios, mostrando errores tanto en el frontend como en el backend.

## Síntomas

### Error en Frontend
```
⨯ Error [UnauthorizedError]: Unauthorized. Error during login: Not Found
    at ApiUserRepository.login (...)
    at async apiLoginUserUC (...)
    at async loginUC (...)
    at async login (...)
```

### Error en Backend
```
❌ [DomainErrorFilter] Something went wrong: Sorry, we couldn't locate that content
DatabaseFindError: Db read readOne doesn't worked. Error en la operación de lectura
    at MongooseUserRepo.readOne (...)
    at UserReadOneUseCase.readByAddress (...)
    at UserController.login (...)
```

## Análisis del Flujo

El problema estaba en el flujo de login de nuevos usuarios:

1. El usuario intenta conectar su wallet
2. El controlador `UserController.login` verifica si el usuario ya existe en la base de datos
3. Para ello, llama a `UserReadOneUseCase.readByAddress(address)`
4. Este método a su vez llama a `userRepository.readOne({ address })`
5. **Aquí estaba el error**: `readOne` lanzaba una excepción cuando no encontraba el usuario en lugar de devolver `null`
6. Como resultado, el flujo se interrumpía antes de poder crear el nuevo usuario

## Logs de Depuración

Al añadir logs para depurar el problema, se observó:

```
[MongooseUserRepo.readOne] Searching with filter: {"address":"0x8043Cf44612f86c388E354584d6Af20764266FC3"}
[MongooseUserRepo.readOne] Document found: false
[MongooseUserRepo.readOne] No document found, throwing error
```

El usuario no se encontraba en la base de datos (lo cual es esperado para un nuevo usuario), pero el método estaba lanzando un error en lugar de permitir que el flujo continuara.

## Solución Implementada

### Cambio 1: Actualizar la interfaz UserInterface

```typescript
// Antes
readOne(filter: Record<string, any>): Promise<UserBase & DBBase>;

// Después
readOne(filter: Record<string, any>): Promise<(UserBase & DBBase) | null>;
```

### Cambio 2: Modificar la implementación de readOne

```typescript
// Antes
async readOne(filter: Record<string, any>): Promise<UserBase & DBBase> {
  try {
    const doc = await this.userModel.findOne(filter);
    if (!doc) {
      throw createDomainError(
        ErrorCodes.DATABASE_FIND,
        MongooseUserRepo,
        'readOne',
        undefined,
        { optionalMessage: 'Error en la operación de lectura' },
      );
    }
    return this.documentToPrimary(doc);
  } catch (error) {
    // Manejo de errores...
  }
}

// Después
async readOne(filter: Record<string, any>): Promise<(UserBase & DBBase) | null> {
  try {
    const doc = await this.userModel.findOne(filter);
    if (!doc) {
      console.log('[MongooseUserRepo.readOne] No document found, returning null');
      return null;
    }
    return this.documentToPrimary(doc);
  } catch (error) {
    // Manejo de errores solo para problemas reales de BD...
  }
}
```

## Flujo Correcto Después de la Solución

1. El usuario intenta conectar su wallet
2. El controlador `UserController.login` verifica si el usuario existe
3. `UserReadOneUseCase.readByAddress(address)` llama a `userRepository.readOne({ address })`
4. `readOne` ahora devuelve `null` si no encuentra el usuario
5. El controlador detecta que `user` es `null` y crea un nuevo usuario
6. El login continúa exitosamente con el usuario recién creado

## Observaciones Importantes

1. **El método `readByAddress` del repositorio no estaba siendo utilizado**: Había dos implementaciones de `readByAddress`:
   - Una en `UserReadOneUseCase` que llamaba a `readOne`
   - Otra directamente en `MongooseUserRepo`
   
   El controlador estaba usando la primera, por lo que nuestro cambio afectó el flujo correcto.

2. **Cambio limitado al módulo de usuario**: El método `readOne` de otros módulos (como tech) no se vio afectado, ya que pertenecen a interfaces diferentes.

3. **El controlador ya estaba preparado**: El código del controlador ya verificaba `if (!user)` y creaba un nuevo usuario, lo que indica que el flujo estaba diseñado correctamente pero el método subyacente no cumplía con el contrato esperado.

## Resultado

Después de estos cambios, el login de nuevos usuarios funciona correctamente:
- Si el usuario existe, se inicia sesión con su cuenta existente
- Si el usuario no existe, se crea una nueva cuenta y se inicia sesión automáticamente

El problema estaba en un mal contrato en el método `readOne` que lanzaba excepciones cuando no debería hacerlo.
