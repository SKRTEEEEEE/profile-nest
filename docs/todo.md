# ToDo
_El objetivo de este ToDo es ser un pre 'Backlog', no el almacenamiento de tareas_
- ✅ Ideas a futuro -> _sin intención de implementar todavía_
- ✅ Pequeños recordatorios -> _si es necesario (mas de 30 mins) se debe crear un Task_
- ✅ Organización Task -> _preparación hasta tener clara la task_
- ✅ Organización Versión -> _preparación hasta tener clara la version_
- 📄 Ya es Task -> _indica que ya se ha creado un Task en Kanban_
## Test (try)
- [ ] Falta testear la parte de update-tech-octokit
## Documentar
- [ ] Estructura nombres -> user-auth-mock, role-auth-token, ...
- [ ] Estructura carpetas
- [ ] Uso de todo vs uso de Sprint Board
## Extra
- [ ] Crear 'warn' personalizado para notificar acciones y no utilizar nunca console.log y reservar el warn para warn reales (casos en los que se esta haciendo algo mal como programador pero que no causa error - normalmente porque ya esta manejado)
- [ ] Crear Inyector() para 'desvincular' de nestjs
## BEFORE v0.1.0 (next v0.0.9)
This will be the first 'published' version
### 1. 📄 Pensar como integrar mongodb
Para luego dockerizar, debo utilizar un proyecto separado quizas mejor, para hacer los backups etc... o quizas un submodule
### 1. 📄 Dockerizar app 
### 1. 📄 Probar todos los endpoint
### 1. Colgar servidor -> ? v0.0.6
### 1. ⁉️ Hacer test, pensar en que capas y de que tipo
Estaría muy bien un par de tipos(aunque quizas solo un tipo en todas las partes y otro solo en una en modo de ejemplo).
### 1. ⁉️ Integrar CI/CD con Github Actions -> ? v0.0.7
### 2. Documentar todo bien, terminar todo lo anterior y dejar hecho el template -> v0.0.?8
Esto ha de ser una version seguro
### 3. Integrar con Nextjs Actual
Si es posible incluso con version mejorada
### 4. Tratar de escalar a version techs para users - app / saas
Aunque sea simplemente el backend y no se termine de integrar del todo el SaaS.
- [ ] **Incluir limites de subida**