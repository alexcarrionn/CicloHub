# Git, PR y proceso ágil

Fuentes: `.github/CONTRIBUTING.md`, Prácticas Continuas y Gestión Ágil de Proyectos. Si este fichero y `CONTRIBUTING.md` no coinciden, manda `CONTRIBUTING.md`.

## Lo que haces tú y lo que hace la persona

El tutor del grupo revisa en GitHub y en Jira lo que aporta cada miembro, y la nota puede ser individual (ver `entregables-master.md`).


- **No hagas `git commit`, `git push` ni operaciones sobre ramas remotas.** Los commits los firma quien los hace, y no se aceptan commits cuyo autor sea una herramienta de IA.
- Sí puedes crear la rama local de trabajo y consultar el estado (`git status`, `git diff`, `git log`).
- Al terminar, propón:
  1. El mensaje de commit en **Conventional Commits**, en español y en imperativo: `feat(reservas): añade la cancelación de una reserva`. Tipos: `feat`, `fix`, `docs`, `test`, `refactor`, `build`, `chore`, `ci`.
  2. El texto del PR siguiendo `.github/PULL_REQUEST_TEMPLATE.md`, con `Closes #<issue>`, la historia de Jira (`E3-xx`), cómo se ha probado y la **declaración de uso de IA** (herramienta y alcance).

## Ramas

`<tipo>/<número-issue>-<slug>` a partir de `main`. Ejemplo: `feat/12-reservar-bicicleta`.

## Integración y entrega continuas

- La CI (`.github/workflows/ci.yml`) ejecuta: título del PR en formato Conventional Commits → formato y lint → tests con cobertura y e2e → build → imagen Docker con healthcheck, comprobación de usuario no root y prueba de humo. **Antes de entregar, reproduce en local lo que puedas** (`format:check`, `lint`, `test:coverage`, `test:e2e`, `build`).
- `release.yml` publica la imagen en GHCR al fusionar en `main` y con etiquetas `vX.Y.Z` (SemVer).
- Los cambios en workflows, en el `Dockerfile` o en `docker-compose.yml` son de tipo `ci` o `build`. No los mezcles con funcionalidad.
- No toques `ai-summary.yml` sin que se pida: tiene restricciones de seguridad (`pull_request_target`).

## Historias de usuario

- Cada tarea parte de una historia de Jira (proyecto **E3**) con formato *Como… quiero… para…* y criterios de aceptación en **Gherkin** (Dado / Cuando / Entonces).
- **Cada criterio de aceptación se convierte en al menos una prueba** (normalmente una prueba backend con Supertest), cuyo nombre lo refleja.
- Si un criterio de aceptación es ambiguo o falta, **pregunta**: no lo inventes. Sería trabajo que el Product Owner no ha pedido (desperdicio).
- Implementa solo lo que pide la historia. Ni funcionalidad extra ni generalizaciones "por si acaso".

## Definición de Hecho (DoD)

Una historia está hecha cuando:

1. Cumple todos sus criterios de aceptación y cada uno tiene su prueba.
2. Tiene pruebas unitarias (dominio con caja blanca, aplicación y manejadores) y **pruebas backend** con Supertest, y todas pasan.
3. Sus endpoints tienen peticiones en `request/*.rest`, documentación en OpenAPI y comprobación en `scripts/comprobar-api.sh`.
4. Cobertura de al menos el 80 % en el código nuevo y sin bajar la del proyecto.
5. Lint y formato limpios, y compila.
6. Cumple `seguridad-rgpd.md`, incluido el aislamiento entre gestores.
7. Los mensajes al usuario final van como códigos traducibles (ES/EN).
8. Si publica o consume eventos, sus contratos están en `libs/contratos` y los consumidores son idempotentes.
9. La CI está en verde y un code owner ha aprobado el PR. Esto último ya lo hace el equipo.

Usa la skill `revisar-dod` para comprobarlo antes de dar la tarea por terminada.
