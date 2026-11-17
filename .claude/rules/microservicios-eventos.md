---
paths:
  - "apps/**/*.ts"
  - "libs/**/*.ts"
  - "nest-cli.json"
  - "docker-compose.yml"
---

# Microservicios, eventos y pasarela

Fuentes: enunciado (sección 3.2, Desarrollo Full-Stack), DFS sesión 8 (microservicios) y el tutorial de microservicios con NestJS.

> Cómo se parten los microservicios, qué microservicio lleva CQRS/ES y el transporte son **decisiones pendientes** (ver `CLAUDE.md`). Las reglas de abajo valen en cualquier caso.

## Monorepo

- Una app de Nest por servicio (`npx nest g app <nombre>`) y librerías compartidas (`npx nest g library <nombre>`):
  - `apps/gateway`: la única app que escucha HTTP desde fuera.
  - `apps/<servicio>`: microservicios (`NestFactory.createMicroservice`).
  - `libs/shared`: patrones DDD y `Either`.
  - `libs/contratos`: nombres de los patrones de mensaje y de los eventos, y sus *payloads*.
- Un microservicio **no importa código de otro microservicio**. Solo comparten `libs/shared` y `libs/contratos`.
- **Cada microservicio tiene su propia base de datos.** Nadie lee la base de datos de otro.

## Comunicación

- **Por defecto, eventos asíncronos** (`@EventPattern` y `client.emit`). Ejemplos: `BicicletaAlquilada`, `ReservaCaducada`, `EstacionLlena`, `UsuarioBloqueado`.
- **Mensajes síncronos** (`@MessagePattern` y `client.send`) solo cuando la pasarela necesita una respuesta para contestar al cliente, o cuando una consulta no se puede resolver con datos propios.
- Los nombres de patrones y eventos son **constantes en `libs/contratos`**, nunca cadenas sueltas. Los eventos se nombran en pasado.
- Los *payloads* son objetos planos y serializables, con versión si cambian. No se envían agregados.
- Los consumidores son **idempotentes**: recibir dos veces el mismo evento no duplica efectos.
- Cuando un servicio necesita datos de otro (por ejemplo, alquileres necesita saber si el usuario está bloqueado), mantiene una **proyección local** alimentada por eventos.
- Transporte: NATS (visto en clase), salvo que el equipo decida otro. Se configura con variables de entorno.
- Los eventos de dominio de un agregado (`pullDomainEvents()`) se publican **después** de guardarlo correctamente.

## Pasarela (`apps/gateway`)

- Expone la API REST con **OpenAPI** (ver `api-rest.md`) y el módulo **GraphQL**.
- **Valida el JWT** y saca de él el usuario, el rol y el `gestorId`. Ese contexto se envía en cada mensaje a los microservicios, que **no aceptan un `gestorId` del cuerpo de la petición del cliente**.
- No tiene lógica de negocio: traduce HTTP o GraphQL a mensajes y las respuestas o errores a HTTP.

## CQRS y Event Sourcing

Solo en el microservicio que decida el equipo:
- Las escrituras (comandos) y las lecturas (consultas) usan modelos separados, y el de lectura está optimizado para las consultas.
- Con Event Sourcing, el estado del agregado se reconstruye a partir de su secuencia de eventos. Los eventos guardados **no se modifican nunca**.
- **Todavía no se ha visto en clase.** Antes de implementarlo, pide a la persona el material de la asignatura y sigue lo que se haya explicado.

## GraphQL

**Todavía no se ha visto en clase.** No lo implementes sin el material de la asignatura. Cuando llegue, convivirá con REST en la pasarela y reutilizará los mismos mensajes a los microservicios.
