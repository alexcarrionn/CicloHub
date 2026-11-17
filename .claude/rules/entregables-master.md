---
paths:
  - "docs/**"
  - "README.md"
---

# Entregables del máster en el repositorio

Fuente: directrices generales del MISUM 2026/27 y sección 3 del enunciado.

## El repositorio es el de todo el máster

Todos los entregables e informes de las asignaturas van en este repositorio, y **cualquier profesor puede consultarlos en cualquier momento**. Por ejemplo, el profesorado de Full-Stack consulta el MVP que se define en GAP. Estructura:

```
docs/
├─ README.md            # índice: qué hay y dónde
├─ gap/                 # entregables 1 y 2 de Gestión Ágil (visión, roadmap, MVP, riesgos, SAFe, seguridad)
├─ ad/                  # análisis de requisitos de datos, esquema conceptual y arquitectura de datos justificada
├─ ccps/                # plan de pruebas, informes de ESLint/SonarQube, mutación, rendimiento, metamórficas, regresión e informe final
├─ pc/                  # pipeline de integración continua y diseño del pipeline de despliegue
└─ dfs/                 # decisiones de arquitectura y documentación técnica
```

- Los documentos se escriben en Markdown (`docs/<asignatura>/<tema>.md`). Las versiones finales en PDF o Word se guardan al lado si la asignatura las pide.
- `docs/site/` lo genera TypeDoc y no se versiona.
- Las decisiones de arquitectura importantes (partición de microservicios, bases de datos, CQRS/ES, OAuth2) se registran en `docs/dfs/decisiones/NNNN-<titulo>.md`: contexto, decisión, alternativas y consecuencias.

## Fechas

| Fecha | Qué |
|---|---|
| 30 oct 2026 | GAP, entregable 1 (definición del proyecto común): ya entregado |
| **8 ene 2027** | GAP, entregable 2 (estimación, gestión del equipo, riesgos, escalado y seguridad) |
| **11 ene 2027** | DFS (entrega parcial de seguimiento), AD, CCPS y PC |
| A partir del 11 ene | Entrevistas por asignatura, con preguntas individuales |

## Evaluación y trabajo en grupo

- El tutor del grupo revisa en **Jira** el reparto de tareas y en **GitHub** las aportaciones de cada miembro. La nota puede ser distinta para cada uno.
- En la entrevista se pregunta a cada persona por el trabajo hecho, así que **quien sube un cambio tiene que entenderlo**. Explica las decisiones en el resumen final de cada tarea, para que la persona pueda defenderlas.
- Por eso: no hagas commits (los firma cada uno) y no metas en una sola tarea trabajo de varias historias.

## Redacción de los informes

Cuando ayudes a redactar un entregable: en español, bien organizado y con **referencias bibliográficas actuales**. Para CCPS, con formato de guion de las pruebas realizadas, interpretando los resultados y documentando los problemas encontrados y sus soluciones. No inventes resultados: los datos (cobertura, mutación, APDEX) salen de ejecuciones reales.
