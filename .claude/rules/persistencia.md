---
paths:
  - "src/**/infraestructura/**/*.ts"
  - "apps/**/infraestructura/**/*.ts"
  - "src/**/*.entity.ts"
  - "src/**/*.schema.ts"
  - "src/app.module.ts"
---

# Persistencia

Fuentes: Desarrollo Full-Stack (repositorios, NestJS + MongoDB, ejercicio de restaurantes) y Arquitectura de Datos (Práctica 4, integración de NestJS con Mongoose).

> El enunciado exige **al menos 2 tipos de base de datos** (por ejemplo, una relacional y una NoSQL), y cada microservicio tiene la suya. Qué base de datos usa cada servicio **lo decide el equipo en Arquitectura de Datos** (ver `CLAUDE.md`). Las reglas generales valen para cualquiera. Las de Mongoose se aplican a los servicios que usen MongoDB. Para los relacionales, pide la decisión del equipo (ORM y motor) antes de añadir dependencias.

## Reglas generales (cualquier base de datos)

- El modelo de persistencia y el de dominio son clases distintas, y un mapper convierte entre ellos.
- El repositorio implementa el puerto del dominio y devuelve agregados, nunca filas ni documentos.
- Toda consulta de datos de un gestor filtra por `gestorId`, y hay un índice por ese campo.
- Las operaciones que tocan varios registros y tienen que ser consistentes van en una **transacción**, si la base de datos la ofrece. Entre microservicios no hay transacciones: la consistencia es **eventual**, mediante eventos.
- La conexión se configura con variables de entorno. Las pruebas usan **una base de datos de pruebas distinta**, también configurada con variables de entorno (ver `pruebas.md`).

## MongoDB con Mongoose

### Modelo de persistencia frente a modelo de dominio

- Son **clases distintas**. El esquema de Mongoose (`@Schema`, `@Prop`) vive en `infraestructura/` y se llama `<Entidad>Entity` en `<entidad>.entity.ts`. El agregado de dominio no lleva decoradores de Mongoose.
- `_id` es de tipo **string** y guarda el UUID del agregado. No se usa el `ObjectId` ni se añaden campos de id duplicados.
  ```ts
  @Schema({ collection: 'bicicletas' })
  export class BicicletaEntity {
    @Prop() _id: string;
    @Prop({ required: true, index: true }) gestorId: string;
    // ...
  }
  ```
- Los tipos complejos se declaran explícitamente (`@Prop({ type: Object })`, `@Prop({ type: [...] })`) o con subesquemas.
- La conversión entre los dos modelos se hace en un mapper con métodos estáticos `aDominio()` y `aPersistencia()`. Al reconstruir el agregado se reutiliza su `id` y no se generan eventos de creación.

### Repositorio

- Implementa el puerto del dominio: `RepositorioBicicletasMongo extends RepositorioBicicletas`.
- El modelo se inyecta con `@InjectModel(BicicletaEntity.name)` y se registra con `MongooseModule.forFeature([...])` en el módulo del contexto.
- Las consultas terminan en `.exec()` y devuelven agregados de dominio, **nunca documentos de Mongoose**.
- `findById` sin resultado: devuelve un `Either` con un error de no encontrado, o `null` si así lo define el puerto. No se lanza `Error` a secas.
- **Multi-tenant:** toda consulta, actualización o borrado de datos de un gestor incluye `gestorId` en el filtro. Hay un índice por `gestorId` en cada colección.
- **No uses** los datos de la petición directamente como filtro de Mongo, para evitar inyección NoSQL. Los filtros se construyen con valores ya validados del dominio.

## Pruebas

- Para las pruebas unitarias de servicios hay una **implementación en memoria** del repositorio (`RepositorioBicicletasMemoria`, con un `Map`) o un doble con `jest.fn()`.
- La implementación de Mongo se prueba en pruebas de integración o e2e, no con mocks de Mongoose.

## Configuración

- La URI de conexión sale de una variable de entorno (`MONGODB_URI`), que se lee con `ConfigModule`. **Nunca se escribe en el código.**
- `docker-compose.yml` levanta Mongo para desarrollo con un volumen con nombre.
- Cada microservicio tiene su propia base de datos: no se comparten esquemas.
