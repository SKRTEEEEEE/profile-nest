⁉️⁉️⁉️⁉️
- Esta capa nos facilita la inyección al no tener que vincular cada Caso De Uso(app) con su Repo(infra)
- Para ver como **NO** utilizar esta capa ver el ejemplo de implementación en pre-tech -> [pre-tech.usecase.ts] y [pre-tech.module.ts]

## Mi criterio 
- Utilizado para funciones de la bdd ⁉️
- No utilizar para métodos derivados (de otras funciones de bdd) -> readAll from read
- No utilizar para funciones no incluidas en pattern ⁉️ -> read-one.interface