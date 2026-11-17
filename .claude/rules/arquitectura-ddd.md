---
paths:
  - "src/**/*.ts"
  - "apps/**/*.ts"
  - "libs/**/*.ts"
---

# Arquitectura: DDD y arquitectura hexagonal

Fuente: Desarrollo Full-Stack (sesiones 3 a 8: entidades y valores, repositorios, agregados y eventos, gestión de errores, NestJS y API Web).

## Capas y dependencias

| Capa | Carpeta | Contiene | Puede importar |
|---|---|---|---|
| Dominio | `dominio/` | Agregados, entidades, valores, eventos, errores de dominio y el **puerto del repositorio** (clase abstracta) | Solo `src/shared` y otros ficheros de dominio |
| Aplicación | `aplicacion/` | **Puerto del servicio** (clase abstracta) y su implementación `@Injectable()` (casos de uso) | Dominio |
| Infraestructura | `infraestructura/` | Esquemas de persistencia, implementación del repositorio, mappers dominio ↔ persistencia, y publicación y consumo de eventos | Dominio, `libs/contratos`, librerías externas |
| API | `api/` | En la pasarela: controlador REST, DTO y mappers a DTO. En un microservicio: manejadores `@MessagePattern` y `@EventPattern` | Aplicación (el puerto) y dominio |

- El **dominio no importa** `@nestjs/*`, librerías de persistencia (`mongoose`, `typeorm`, `pg`…), `express` ni `class-validator`. Es TypeScript puro y se puede probar sin Nest.
- Los controladores dependen del **puerto** del servicio (la clase abstracta), nunca de la implementación.
- Los servicios dependen del **puerto** del repositorio, nunca de una implementación concreta de base de datos.
- Las implementaciones se enlazan en el módulo:
  ```ts
  providers: [
    { provide: RepositorioBicicletas, useClass: RepositorioBicicletasMongo },
    { provide: ServicioBicicletas, useClass: ServicioBicicletasImpl },
  ]
  ```
- Evita los modelos anémicos: las reglas de negocio viven en los agregados y los valores, no en los servicios.

## Patrones tácticos (en `libs/shared/` o, mientras no haya monorepo, en `src/shared/dominio/`)

Usa las clases base del proyecto y no crees otras paralelas:

- **`UniqueEntityID`:** identificador UUID v4 (`uuid`). Se valida si llega desde fuera.
- **`Entity<T>`:** las propiedades se declaran en una interfaz `XxxProps` y se guardan en `props`. La igualdad se basa en el identificador.
- **`ValueObject<T>`:** inmutable (`Object.freeze`), con igualdad estructural. **Valida en su método factoría.**
- **`AggregateRoot<T>`:** extiende `Entity`. Protege las invariantes y registra eventos con `addDomainEvent`; se extraen con `pullDomainEvents()`.
- **`DomainEvent`:** tiene como mínimo `occurredOn: Date`. Se nombra en pasado: `BicicletaAlquiladaEvent`, `ReservaCanceladaEvent`.
- **Repositorio:** clase abstracta genérica `Repository<T>` (`save`, `findById`, `remove`). Cada agregado tiene la suya (`RepositorioBicicletas extends Repository<Bicicleta>`), con sus consultas específicas.

Construcción: **constructor privado** y método estático `create(...)`. Para reconstruir desde persistencia se pasa el `id` existente.

## Errores: estilo funcional con `Either`

- Las operaciones del dominio y de la aplicación que pueden fallar devuelven `Either<ErrorDeDominio, T>` (`left` para el error y `right` para el valor). **No lanzan excepciones** por errores de negocio.
- Cada error de dominio es una clase con constructor privado y `static create(...)` que implementa `DomainError` (`errorMessage`). Ejemplos: `BicicletaNoDisponibleError`, `CodigoActivacionInvalidoError`.
- Declara en la firma todos los errores posibles: `Either<ReservaDuplicadaError | LimiteReservasError, Reserva>`.
- Las excepciones se reservan para fallos inesperados de infraestructura. Envuélvelas en `UnexpectedError` cuando lleguen al dominio.
- **El dominio nunca lanza `HttpException`.** Traducir errores de dominio a códigos HTTP es tarea del controlador (ver `api-rest.md`).

## Multi-tenant en la arquitectura

- Todo agregado de un gestor tiene `gestorId` en sus props.
- Los métodos del repositorio que consultan datos de un gestor **reciben el `gestorId` y filtran por él**. No hay métodos que devuelvan datos de todos los gestores, salvo que sean de administración y se hayan pedido expresamente.
- El `gestorId` se obtiene del usuario autenticado, **nunca del cuerpo de la petición**.

## Módulos de Nest

- Un módulo por contexto del dominio. Solo exporta el puerto del servicio si otro módulo lo necesita.
- Evita las referencias circulares entre módulos. Si aparecen, comunica los contextos con eventos de dominio en lugar de usar `forwardRef`.
- Genera las piezas con la CLI (`npx nest g module|controller|service <nombre>`) y luego colócalas en la carpeta de su capa.

## Microservicios

Cada microservicio aplica esta misma estructura por capas a sus contextos. Las reglas de comunicación, la pasarela y CQRS/ES están en `microservicios-eventos.md`.
