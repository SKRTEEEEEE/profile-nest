# ToDo
## Test
- [x] Falta testear la parte del auth, conexion, nextjs - nestjs, mediante JWT
## UNIFICAR TIPOS
- [x] Pensar una logica de tipos para las PROPS y las RES
    - Pensar a raíz de que punto crear el resto, pero utilizar una base y evitar duplicar tipos 

    -- por.ej -> Si utilizo -ReadProps, UpdateProps

    -> SOLO EXTENDER A PARTIR DE ESTOS TIPOS PASANDO-LE LOS GENÉRICOS
     
    -> ... Definir mas reglas para los tipos ...
- [x] Analizar la question de los dos tipos de implementación (en infra/mongoose/entities) -> <Entitie>Repository - (app/interface/entitie) - <entite>.interface.ts vs Mongoose<Pattern> - infra/types.patterns.d.ts
    - [ ] Donde se esta radicando la diferencia que no permite implementar los ambos
    - [x] Si dicha diferencia es inevitable (por los tipos dinámicos), en que punto debo pasar de una interfaz(tipos) a la otra.
        
        -> Yo creo que tiene que ser en la capa en question (en infra/mongoose/entities)
        
        -> Pero hay que analizar-lo bien y documentar-lo

        - Se pueden utilizar tipos distintos de entrada mientras estos no interfieran uno frente al otro (osea han de ser 'equivalentes', haciendo que uno sea mas pobre que el otro en tipado)
## Documentar
- [ ] Estructura nombres -> user-auth-mock, role-auth-token, ...
- [ ] Definir Estructura role-auth
- [ ] Definir Estructura thirdweb-auth
## Extra
- [ ] Crear Inyector() para 'desvincular' de nestjs
- [ ] 
