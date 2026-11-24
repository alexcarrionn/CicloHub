/*
 * Librería compartida con los patrones tácticos de DDD (UniqueEntityID,
 * Entity, ValueObject, AggregateRoot, DomainEvent, Repository y Either).
 * Se importa como `@app/shared` desde cualquier microservicio.
 *
 * Las clases van en `src/dominio/`, una por fichero y con sus pruebas, y se
 * exportan desde aquí. Es TypeScript puro: no puede importar nada de NestJS
 * ni de librerías de persistencia (ver `.claude/rules/arquitectura-ddd.md`).
 */
export {};
