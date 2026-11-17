---
paths:
  - "apps/gateway/**/*.ts"
  - "src/**/api/**/*.ts"
  - "src/**/*.controller.ts"
  - "src/**/*.dto.ts"
  - "src/main.ts"
---

# API REST (adaptador driving)

En el monorepo, la API REST vive en **`apps/gateway`**. La pasarela traduce cada petición a un mensaje para el microservicio correspondiente y su respuesta (o error) a HTTP. Mientras no haya monorepo, estas reglas se aplican a los controladores de `src/`.

Fuente: Desarrollo Full-Stack, API Web en NestJS (partes 1 y 2) y ejercicio de restaurantes.

## Controladores

- El controlador solo habla HTTP: recibe la petición, llama al **puerto** del servicio, traduce el resultado y responde. **No contiene lógica de negocio.**
- Rutas en plural y en español: `/bicicletas`, `/estaciones/:id/anclajes`, `/reservas`.
- **Creación (POST):** devuelve `201`, el DTO del recurso creado y la cabecera `Location` con su URL:
  ```ts
  import type { Request, Response } from 'express';
  const url = `${req.protocol}://${req.get('host')}${req.path}/${bicicleta.id.value}`;
  return res.status(201).location(url).json(dto);
  ```
- **Consulta (GET):** `200` con el DTO de respuesta, o `404` si el recurso no existe **o pertenece a otro gestor** (no reveles que existe).
- Las acciones sobre un recurso son subrecursos: `POST /bicicletas/:id/incidencias`.

## Traducción de errores de dominio a HTTP

El servicio devuelve un `Either`. El controlador lo comprueba y traduce:

| Tipo de error de dominio | HTTP |
|---|---|
| Validación de un valor (`ValidationXxxError`) | 400 |
| No autenticado | 401 |
| Sin permiso para el rol o el plan | 403 |
| No encontrado | 404 |
| Conflicto con el estado (bici no disponible, reserva duplicada) | 409 |
| `UnexpectedError` | 500, sin detalles internos en la respuesta |

Centraliza esta traducción en un mapper o en un filtro de excepciones del proyecto, en vez de repetirla en cada método.

## DTO

- Dos tipos: **petición** y **respuesta**.
  - Petición: `<Accion><Entidad>RequestDto` en `<accion>-<entidad>-request.dto.ts`. Ejemplo: `CrearReservaRequestDto` en `crear-reserva-request.dto.ts`.
  - Respuesta: `<Entidad>ResponseDto` en `<entidad>-response.dto.ts`.
  - DTO de valores con nombre simple: `UbicacionDto`.
- Los ficheros **terminan en `.dto.ts`**, porque el plugin de Swagger solo procesa esos.
- El DTO de creación **no lleva `id`** ni campos que decide el sistema, como `gestorId`, el estado o las fechas.
- Los DTO de actualización se derivan con `PartialType` de **`@nestjs/swagger`**, no de `@nestjs/mapped-types`.
- La conversión dominio → DTO se hace en un mapper (métodos estáticos). Nunca se devuelve un agregado ni un documento de Mongoose tal cual.

## Validación

- `ValidationPipe` global con `transform: true`, `whitelist: true` y `forbidNonWhitelisted: true`.
- Los DTO se validan con `class-validator`; los objetos anidados con `@ValidateNested()` y `@Type(() => X)`.
- La validación del DTO es **sintáctica** (formato, obligatoriedad). Las **reglas de negocio** se validan en los valores y agregados del dominio. No dupliques reglas de negocio en el DTO.

## OpenAPI

- Swagger UI en `/api` y la especificación en `/api-json`.
- El plugin `@nestjs/swagger` está en `nest-cli.json` con `classValidatorShim` e `introspectComments`. Documenta los DTO con comentarios JSDoc en lugar de llenarlos de `@ApiProperty`.
- Documenta las respuestas de error con `@ApiResponse` y la seguridad con `@ApiBearerAuth` cuando haya autenticación.

## Ficheros `.rest`

Cada endpoint nuevo tiene sus peticiones de ejemplo en `request/<contexto>.rest` (formato de la extensión REST Client): el caso feliz y los errores principales. Lo exige CCPS.

## Prueba de humo

Cada endpoint nuevo añade su comprobación en `scripts/comprobar-api.sh`: el caso feliz y al menos un error. La CI lo ejecuta contra la imagen Docker.
