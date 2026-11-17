---
name: nuevo-contexto
description: Crea la estructura de un nuevo microservicio o de un contexto del dominio de CicloHub con las capas DDD-hexagonales, y las librerías compartidas si aún no existen. Úsala cuando haga falta un microservicio, módulo o contexto nuevo.
---

# Crear un microservicio o un contexto del dominio

## 0. Comprobar el estado del repo

- Si todavía **no es monorepo** (no hay `apps/`), no lo conviertas por tu cuenta. Avisa de que hace falta y pregunta. Convertirlo (`nest g app gateway` y uno por servicio) es una tarea propia que el equipo tiene que acordar, porque cambia la CI, el `Dockerfile` y `docker-compose.yml`.
- Comprueba en `CLAUDE.md` que la partición de microservicios está decidida y en qué servicio va este contexto. Si no lo está, pregunta.

## 1. Librerías compartidas (si no existen)

```bash
npx nest g library shared
npx nest g library contratos
```

`libs/shared/src/dominio/`, un fichero por clase y con sus pruebas unitarias:

```
unique-entity-id.ts   entity.ts   value-object.ts   aggregate-root.ts
domain-event.ts       domain-error.ts (con UnexpectedError)
either.ts             repository.ts (abstract Repository<T>)
```

`libs/contratos/src/<servicio>/`: constantes con los patrones de mensaje y de evento, y las interfaces de sus *payloads*.

Las dependencias nuevas (`uuid`, cliente de NATS…) se instalan **solo después de avisar**.

## 2. Microservicio nuevo (si hace falta)

```bash
npx nest g app <servicio>
```

- `main.ts` con `NestFactory.createMicroservice` y el transporte configurado por variables de entorno.
- Su propia base de datos (la que haya decidido el equipo) y su servicio en `docker-compose.yml`.
- En la pasarela, el `ClientsModule.register` para comunicarse con él.

## 3. Contexto dentro del servicio

`npx nest g module <contexto> --project <servicio>`, y después la estructura a mano. **No uses `nest g resource`**, porque genera un CRUD anémico:

```
apps/<servicio>/src/<contexto>/
├─ dominio/          <agregado>.ts, <valor>.ts, eventos/, errores/, repositorio-<contexto>.ts (abstracta)
├─ aplicacion/       servicio-<contexto>.ts (puerto) y servicio-<contexto>.impl.ts
├─ infraestructura/  esquema o entidad, mapper de persistencia, repositorio de la BD, repositorio en memoria y publicador de eventos
├─ api/              <contexto>.handler.ts (@MessagePattern y @EventPattern)
└─ <contexto>.module.ts
```

En la pasarela: `apps/gateway/src/<contexto>/` con el controlador, `dto/` y el mapper a DTO.

Enlaza los puertos en el módulo:

```ts
providers: [
  { provide: RepositorioBicicletas, useClass: RepositorioBicicletasMongo },
  { provide: ServicioBicicletas, useClass: ServicioBicicletasImpl },
]
```

Crea también `request/<contexto>.rest` vacío, con la URL base como variable.

## 4. Comprobar

`npm run lint && npm run build` (y `nest build <app>` para cada app tocada). El servicio tiene que arrancar.
