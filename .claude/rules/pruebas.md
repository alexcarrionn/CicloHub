---
paths:
  - "**/*.spec.ts"
  - "**/*.e2e-spec.ts"
  - "test/**"
  - "apps/**/test/**"
  - "request/**"
  - "cypress/**"
  - "pruebas/**"
  - "scripts/comprobar-api.sh"
  - "stryker.config.*"
---

# Pruebas

Fuentes: enunciado (sección 3.4, Control de Calidad y Pruebas del Software), temas 1 a 7 y prácticas de CCPS, y `CONTRIBUTING.md`.

## Lo que pide CCPS (entregable del 11 de enero)

| Prueba | Herramienta | Dónde | Qué se exige |
|---|---|---|---|
| Plan de pruebas | — | `docs/ccps/plan-de-pruebas.md` | Estructura de la **plantilla de plan de pruebas ágil** de la asignatura |
| Unitarias | **Jest** | `**/*.spec.ts`, junto al código | **Caja blanca**: caminos básicos, condiciones y bucles, en al menos un módulo |
| Mutación | **Stryker** | `stryker.config.*` | Sobre las unitarias. Interpretar los mutantes vivos y **matar o marcar como equivalente** al menos uno |
| Backend (endpoints) | **ficheros `.rest`** y **Supertest** | `request/*.rest` y `test/` o `apps/*/test/` | Asertos sobre el comportamiento de los endpoints, con **base de datos de pruebas configurada por variables de entorno** |
| Frontend | **jest-dom** | junto a los componentes | Pruebas de la interfaz con el DOM simulado |
| e2e | **Cypress** | `cypress/` | **Al menos un caso de uso** completo de la aplicación |
| Rendimiento | **JMeter** | `pruebas/rendimiento/*.jmx` | Plan completo (listeners, aserciones, controladores) con **límites de métricas, por ejemplo APDEX**, comprobados |
| Metamórficas | Jest | `**/*.spec.ts` | Plan de pruebas metamórficas a nivel unitario o de front, con una estrategia definida |
| Regresión | — | `docs/ccps/` | Estrategia por **selección, minimización o priorización** y casos basados en ella |

Además: el informe final de CCPS, con formato de guion, interpreta los resultados, documenta los problemas y sus soluciones, y lleva referencias bibliográficas actuales. Ver `entregables-master.md`.

> En este proyecto, **«e2e» quiere decir Cypress**. Las pruebas de endpoints con Supertest son **«pruebas backend»**, aunque el script de Nest se llame `test:e2e`.

## Pruebas unitarias: diseño de casos

**Caja blanca** (lo que pide el enunciado). Indica la técnica en el `describe` o en un comentario:
- **Caminos básicos:** calcula la complejidad ciclomática del método y escribe un caso por cada camino independiente.
- **Condiciones:** cada condición simple de una decisión compuesta toma los valores verdadero y falso al menos una vez.
- **Bucles:** 0 iteraciones, 1, 2, una típica, y n-1, n y n+1 si hay un máximo. Por ejemplo, las 3 reservas caducadas o las 10 estaciones del plan Básico.

**Caja negra**, como complemento en valores y reglas:
- Particiones de equivalencia válidas e inválidas.
- Valores límite: el límite, uno por debajo y uno por encima. Por ejemplo: 2, 3 y 4 reservas caducadas; 99, 100 y 101 bicicletas en el plan Básico; justo antes y justo después del fin del plazo de reserva.
- Tablas de decisión cuando se combinan condiciones (bloqueado × reserva activa × alquiler activo).

## Estilo

- **AAA** (Arrange, Act, Assert), con las partes separadas por una línea en blanco. Una conducta por prueba.
- Nombres en español que describen la conducta: `it('bloquea al usuario al acumular la tercera reserva caducada', ...)`.
- Pruebas independientes: la preparación va en `beforeEach`, sin estado compartido ni dependencia del orden.
- Con `Either`, comprueba el lado (`isLeft()` o `isRight()`) **y** el tipo de error con `toBeInstanceOf`.
- Comprueba también los **eventos de dominio** emitidos.
- Para el tiempo (plazos de reserva, límites diarios y semanales, 2 horas extra), usa un **reloj inyectable** o `jest.useFakeTimers()`. Nunca dependas de la hora real.
- Nada de `it.only`, `describe.only` ni `skip` sin justificar.

## Dobles de prueba

- **Stub** (`mockResolvedValue` y `mockRejectedValue`) para controlar entradas indirectas; **spy** (`jest.spyOn`) para verificar llamadas a una implementación real; **mock** (`toHaveBeenCalledWith`) solo cuando lo que se prueba es la interacción.
- Usa dobles solo de lo que está fuera del sistema bajo prueba: repositorios, reloj, generador de códigos, `ClientProxy` de otros microservicios. **No hagas doble del dominio.**
- En Nest: `Test.createTestingModule({ providers: [{ provide: Puerto, useValue: doble }] })`.
- Limpia los dobles entre pruebas (`jest.clearAllMocks()`).

## Pruebas backend

- `request/<contexto>.rest` con las peticiones de cada endpoint: el caso feliz y los errores.
- Supertest: códigos de estado, cuerpo, cabecera `Location`, validación (400), permisos (401 y 403) y **aislamiento entre gestores**.
- **Nunca contra la base de datos de producción.** La conexión de pruebas sale de variables de entorno en `.env.test` (versionado como `.env.test.example`).
- Los datos de prueba son ficticios y cada prueba deja la base de datos limpia.

## Mutación (Stryker)

- Se aplica a la lógica de dominio que tiene pruebas de caja blanca.
- Si un mutante sobrevive, analiza por qué: si es **equivalente**, márcalo con `// Stryker disable next-line <Mutador>: <motivo>`; si es por **falta de calidad de los casos**, añade el caso que lo mata. Documenta el análisis para el informe.

## Umbrales

- **Cobertura:** objetivo del 70-80 % en el proyecto y del 80 % en el código nuevo (`codecov.yaml`, patch). La cobertura de **ramas** importa más que la de líneas.
- **Mutación:** puntuación de 0,8 o más en el módulo que se analice.
- **Rendimiento:** los límites (APDEX, tiempos de respuesta) se fijan en el plan de pruebas de rendimiento y se comprueban con aserciones de JMeter.
