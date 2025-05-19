# ToDo
## Test
- [ ] Falta testear la parte de update-tech-octokit
- [x] Falta testear la parte del auth, conexion, nextjs - nestjs, mediante JWT
## Documentar
- [ ] Estructura nombres -> user-auth-mock, role-auth-token, ...
- [ ] Estructura carpetas
## Extra
- [ ] Crear 'warn' personalizado para notificar acciones y no utilizar nunca console.log y reservar el warn para warn reales (casos en los que se esta haciendo algo mal como programador pero que no causa error - normalmente porque ya esta manejado)
- [ ] Crear Inyector() para 'desvincular' de nestjs
- [ ] 🤔⁉️ Mejorar parte **techs** cambiar bdd para mejorar enfoque?
## Unificar tipos
- [x] Pensar una logica de tipos para las PROPS y las RES
    - Pensar a raíz de que punto crear el resto, pero utilizar una base y evitar duplicar tipos 

    -- por.ej -> Si utilizo -ReadProps, UpdateProps

    -> SOLO EXTENDER A PARTIR DE ESTOS TIPOS PASANDO-LE LOS GENÉRICOS
     
    -> ... Definir mas reglas para los tipos ...
- [x] Analizar la question de los dos tipos de implementación (en infra/mongoose/entities) -> <Entitie>Repository - (app/interface/entitie) - <entite>.interface.ts vs Mongoose<Pattern> - infra/types.patterns.d.ts
    - [x] Si dicha diferencia es inevitable (por los tipos dinámicos), en que punto debo pasar de una interfaz(tipos) a la otra.
        
        -> Yo creo que tiene que ser en la capa en question (en infra/mongoose/entities)
        
        -> Pero hay que analizar-lo bien y documentar-lo

        - Se pueden utilizar tipos distintos de entrada mientras estos no interfieran uno frente al otro (osea han de ser 'equivalentes', haciendo que uno sea mas pobre que el otro en tipado)
### Unificar Res y ERRORS v1 
- [x] Incluir siempre message y success
## DTOs
- [x] Mirar en que capas quiero DTOs: controllers - se pueden reutilizar si tiene sentido en infra
- [ ] Hacer DTOs
- [x] Integrar buen funcionamiento
## Terminar tech-octokit/create.repo.ts
- [x] Hacer que saque lo necesario para actualizar.repo.ts


