# Replay a Reporte Análisis
## Explicación Areas de Mejora
### 1. NO estoy de acuerdo, valorar
Actualmente, en algunos casos tengo los usecases granualares, ya que aveces estos se entremezclan con otros usecases granulares, cuando dos entidades han de interactuar, por lo que creo que para evitar traer todas las funciones quizás es una buena practica. Dame tu opinion y valora-lo.
### 2. Estoy de acuerdo, aplicar
- Quiero que no se use Repository, por lo que las Interfaces, se deberá unificar a la palabra Interface
### 3. Tienes razón, aplicar
- Muestrame como mejorar esto y aplicalo
### 4. Tienes razón, pero no lo veo prioritario
Creo que tengo demasiada documentación y aun ha de cambiar mucho el codigo asi que no lo veo necesario por ahora
### 5. NO estoy de acuerdo, no aplicar
Shareds esta asi, ya se que se podria crear submenus, pero lo veo inecesario por el alcance actual de la app, en el futuro se ara pero cuando yo lo vea oportuno
### 6. NO estoy de acuerdo, valorar + no aplicar
No estoy de acuerdo, actualmente en domain, los typos .d.ts son typos puros de ts, no clases ni tienen funcionalidad, y son .d.ts porque son globales, vd? en cambio .type.ts, son typos 'funcionales', osea clases, enums y descripciones en const de estas.
### 7. No lo veo, pero estoy de acuerdo, aplicar
No entiendo muy bien lo que dices pero entiendo que si puede estar en domain sin violar las reglas de Clean Arch debería estar-lo, aplica-lo
## Explicación Violaciones
### 1. No lo creo, investiga
No creo que haya responsabilidades de mongo en domain, mira-lo y documenta-lo
### 2. Explicarlo, valorar
Explicate mejor con ejemplos y ejemplos de la solución
## Explicacion Malas Prácticas
### 1. De acuerdo, aplica
Corrige el uso de any
