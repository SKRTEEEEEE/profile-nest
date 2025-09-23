# Octokit infrastructure

## useTopics

## ¿Cómo se calculan los datos de uso de un topic en los repositorios?

Supongamos que la respuesta es:

```json
{
  "useGithub": 2.83,
  "useReposPor": 15.15,
  "useReposFrac": "5/33",
  "useImportancePor": 4.29
}
```

### 1. `topicSizePer` -> old: (`useGithub`)

**¿Qué es?**  
Porcentaje del tamaño total de los repositorios (con topics) que corresponde al topic/lenguaje buscado.

**¿Cómo se calcula?**

- Se suman los tamaños (`size`) de todos los repositorios que contienen el topic buscado.
- Se suman los tamaños de todos los repositorios que tienen al menos un topic.
- El porcentaje es:  
  `(suma de tamaños de repos con el topic / suma de tamaños de todos los repos con topics) * 100`

---

### 2. `topicRepoPer` -> old: (`useReposPor`)

**¿Qué es?**  
Porcentaje de repositorios (con topics) en los que aparece el topic/lenguaje buscado.

**¿Cómo se calcula?**

- Se cuentan los repositorios que tienen al menos un topic.
- Se cuentan los repositorios que incluyen el topic buscado.
- El porcentaje es:  
  `(número de repos con el topic / número total de repos con topics) * 100`

---

### 3. `topicRepoFrac` -> old: (`useReposFrac`)

**¿Qué es?**  
Fracción que indica cuántos repositorios (con topics) usan el topic buscado respecto al total de repositorios con topics.

**¿Cómo se calcula?**

- El numerador es el número de repositorios que contienen el topic buscado.
- El denominador es el número total de repositorios que tienen al menos un topic.
- El resultado es una cadena con el formato:  
  `"reposConTopic/reposConTopicsTotales"`  
  (por ejemplo, `"5/33"` significa que 5 de 33 repositorios usan ese topic).

---

**Nota:**  
Todos los cálculos excluyen los repositorios que no tienen ningún topic.

### 4. `topicImportanceScore` -> old: (`useImportancePor`)

**¿Qué es?**  
Métrica compuesta que refleja la importancia relativa de un topic/lenguaje en el conjunto de repositorios del usuario, combinando tanto su presencia (porcentaje de repositorios donde aparece) como su peso (porcentaje del tamaño total que representa).

**¿Cómo se calcula?**

- Se multiplica el porcentaje de tamaño (`useGithub`) por el porcentaje de repositorios (`useReposPor`).
- El resultado se normaliza (por ejemplo, dividiendo entre 10) para mantenerlo en una escala porcentual.
- La fórmula es:  
  `(topicSizePer * topicRepoPer) / 10`

Esta métrica será alta solo si el topic aparece en muchos repositorios **y** esos repositorios representan una parte significativa del tamaño total.

---
