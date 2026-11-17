---
name: implementar-historia
description: Implementa una historia de usuario de CicloHub (Jira E3-xx / issue de GitHub) de principio a fin siguiendo DDD, microservicios por eventos, pruebas y la DoD. Úsala cuando pidan implementar, desarrollar o empezar una historia, issue o funcionalidad.
---

# Implementar una historia de usuario

Sigue los pasos en orden.

## 1. Entender la historia

1. Consigue el texto de la historia (*Como… quiero… para…*), los criterios de aceptación y el número de Jira (`E3-xx`) y de la issue. Si no te lo han dado, pídelo.
2. Busca las reglas de negocio que le afectan en `.claude/rules/dominio-ciclohub.md`: límites del plan, de uso y de reserva, bloqueos, estados de las incidencias.
3. Identifica el **contexto** y el **microservicio** al que pertenece, el rol que la usa y los **eventos** que publica o consume.
4. **Para y pregunta** si:
   - algún criterio de aceptación es ambiguo o falta;
   - la historia depende de una decisión pendiente (`CLAUDE.md`);
   - toca algo fuera del MVP (ubicación en tiempo real).

## 2. Plan

Antes de escribir código, presenta un plan breve:
- Agregados, valores, eventos de dominio y errores que creas o cambias.
- Puertos (servicio y repositorio) y sus métodos.
- Mensajes y eventos entre servicios (nombres en `libs/contratos`), y proyecciones locales si hacen falta.
- Endpoints de la pasarela: método, ruta, DTO y códigos de respuesta.
- Pruebas:
  - unitarias de caja blanca: caminos, condiciones y bucles de qué métodos;
  - valores límite;
  - pruebas backend, una por criterio de aceptación más aislamiento entre gestores y validación;
  - peticiones en `.rest`.
- La rama: `<tipo>/<issue>-<slug>`.

Espera el visto bueno si el plan añade dependencias, toca `libs/` o afecta a otro microservicio.

## 3. Implementar de dentro hacia fuera

Si el contexto no existe, usa primero la skill `nuevo-contexto`.

1. **Dominio:** valores con su validación, agregado con invariantes y eventos, y errores. Escribe a la vez las pruebas unitarias de caja blanca y de valores límite. Usa un reloj inyectable para todo lo que dependa del tiempo.
2. **Aplicación:** puerto e implementación del servicio, devolviendo `Either`. Pruébalos con el repositorio en memoria.
3. **Infraestructura:** esquema, mapper y repositorio con filtro por `gestorId`, y publicación de los eventos después de guardar.
4. **Microservicio:** manejadores `@MessagePattern` y `@EventPattern`, con consumidores idempotentes.
5. **Pasarela:** DTO, controlador (`Either` o error del microservicio → HTTP, `Location` en 201), OpenAPI y roles.
6. **Pruebas backend** con Supertest y la base de datos de pruebas, **`request/<contexto>.rest`** y `scripts/comprobar-api.sh`.

## 4. Verificar

```bash
npm run format:check && npm run lint && npm run test:coverage && npm run test:e2e && npm run build
```

Corrige hasta que todo pase. Después, usa la skill `revisar-dod` y, si el cambio es grande, el subagente `revisor-codigo`.

## 5. Entregar

No hagas commit. Termina con:
- Un resumen de qué se ha hecho y **por qué** se ha decidido así, para que la persona pueda defenderlo en la entrevista.
- El mensaje de commit propuesto (Conventional Commits).
- El texto del PR según `.github/PULL_REQUEST_TEMPLATE.md`, con `Closes #`, `E3-xx` y la declaración de IA rellenada ("Claude Code: <alcance>").
- Los riesgos detectados, para el análisis de riesgos de GAP, y la deuda técnica, si hay.
