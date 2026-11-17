# CicloHub

Plataforma SaaS **multi-tenant** de préstamo de bicicletas. Es el proyecto común del Equipo 3 del Máster en Ingeniería del Software (UMU, curso 2026/27). Este repositorio es **el repositorio común de todo el máster**: aquí van el código del MVP y los entregables e informes de todas las asignaturas, y los profesores lo consultan directamente.

Las reglas detalladas están en `.claude/rules/`. Se cargan solas, y las de código solo cuando tocas los ficheros a los que se aplican. Este fichero es el resumen.

## Qué se construye (fijado por el enunciado)

- **Backend:** Node.js 22 + **NestJS 11**, con arquitectura limpia o hexagonal y **DDD**.
- **Microservicios** que se comunican **sobre todo por eventos**. Algunos aplicarán **CQRS con Event Sourcing**.
- **Pasarela de API** documentada con **OpenAPI**, más un módulo **GraphQL**.
- **Autenticación con OAuth2** y control de acceso con **tokens JWT**.
- **Datos:** al menos **2 tipos de base de datos**, por ejemplo una relacional y una NoSQL. Cada microservicio tiene la suya.
- **Front:**
  - Primer cuatrimestre: web adaptable con arquitectura **MVC**.
  - Segundo cuatrimestre: React o Next.js, algunos módulos como PWA, y una parte móvil con React Native.
- **Requisitos no funcionales:** español e inglés, WCAG 2.2 AA, disponibilidad 24x7, OWASP Top 10 y LOPD/RGPD.

## Estructura (monorepo de Nest)

```
apps/
├─ gateway/                 # pasarela HTTP: REST + OpenAPI, GraphQL, autenticación
└─ <microservicio>/         # un servicio por contexto (ver «Decisiones pendientes»)
   └─ src/<contexto>/{dominio,aplicacion,infraestructura,api}/
libs/
├─ shared/                  # patrones DDD (Entity, ValueObject, AggregateRoot, Either…)
└─ contratos/               # patrones de mensaje y eventos compartidos entre servicios
request/                    # ficheros .rest para probar los endpoints a mano
docs/                       # entregables e informes por asignatura (docs/gap, docs/ad…)
```

La dependencia va siempre hacia dentro: `api → aplicacion → dominio ← infraestructura`. El dominio **no importa nada de NestJS ni de ninguna librería de persistencia**.

> **Estado actual:** el repo es todavía un proyecto Nest estándar (`src/`). El paso a monorepo con `nest g app` está pendiente de que el equipo acuerde los microservicios.

## Comandos

```bash
npm ci
npm run start:dev [app]   # desarrollo; en monorepo indica la app: gateway, alquileres…
npm run lint              # ESLint (sin --fix, igual que la CI)
npm run format:check      # Prettier (igual que la CI)
npm test                  # unitarias (Jest)
npm run test:coverage
npm run test:e2e          # pruebas backend con Supertest
npm run test:api          # prueba de humo contra la API arrancada
npm run build
docker compose up --build
```

Antes de dar una tarea por terminada, ejecuta `npm run lint`, `npm run format:check`, `npm test` y `npm run test:e2e`, y comprueba que pasan.

## Decisiones pendientes del equipo (no las tomes tú)

Si una tarea depende de alguna de estas decisiones, **pregunta antes de seguir**:

1. **Cómo se parten los microservicios** y qué contextos van en cada uno.
2. **Qué bases de datos concretas** se usan (relacional y NoSQL) y para qué microservicio va cada una. Lo decide la asignatura de Arquitectura de Datos.
3. **Qué microservicio lleva CQRS con Event Sourcing.**
4. **Transporte de eventos.** En clase se ha visto NATS: úsalo salvo que el equipo diga otra cosa.
5. **Proveedor de OAuth2** y dónde vive la autenticación.
6. **Dónde va el front MVC del primer cuatrimestre**: una app del monorepo o un repo aparte.

## Prioridad y plazos

- **11 de enero de 2027:** entrega de DFS, AD, CCPS y PC.
- **8 de enero de 2027:** entregable 2 de GAP.

En DFS la entrega de enero es parcial, así que prioriza las historias del **MVP** que hay en Jira (proyecto **E3**) por encima de funcionalidad completa.

## Forma de trabajar

- Cada tarea corresponde a una historia de Jira y a una issue de GitHub. Usa la skill `implementar-historia`.
- **No hagas commits ni push.** El tutor evalúa la aportación de cada miembro en GitHub, y `CONTRIBUTING.md` no acepta commits hechos por una IA. Prepara los cambios y propón el mensaje de commit.
- Recuerda a la persona que en el PR tiene que **declarar el uso de IA**.
- Escribe el código, los comentarios y los mensajes en **español**, con el lenguaje del dominio: `Bicicleta`, `Estacion`, `Anclaje`, `Alquiler`, `Reserva`, `Incidencia`, `Gestor`, `Usuario`, `Operario`.
- Las dudas sobre los requisitos se resuelven con los profesores. Si algo no está en `.claude/rules/dominio-ciclohub.md`, **pregunta en vez de suponer**.
- Si una regla choca con lo que te piden, avisa del conflicto en vez de saltártela.
