---
name: revisar-dod
description: Comprueba que el trabajo actual cumple la Definición de Hecho de CicloHub antes de abrir un PR. Úsala al terminar una historia o cuando pidan revisar si algo está listo.
---

# Revisar la Definición de Hecho

Revisa los cambios (`git diff main...HEAD` y `git status`) y ejecuta las comprobaciones. Informa con una tabla: punto, ✅ o ❌, y evidencia (comando, fichero o línea).

## Automáticas

```bash
npm run format:check
npm run lint
npm run test:coverage
npm run test:e2e
npm run build
```

En `coverage/`, comprueba que el código nuevo o modificado llega al **80 %**, sobre todo en ramas.

## Manuales

1. **Criterios de aceptación:** cada uno tiene una prueba que lo refleja.
2. **Reglas de negocio:** las que afectan a la historia (de `dominio-ciclohub.md`) están implementadas en el dominio y probadas con sus valores límite.
3. **Pruebas de caja blanca:** los métodos de dominio con lógica tienen cubiertos sus caminos, condiciones y bucles.
4. **Arquitectura:** el dominio no importa frameworks. Compruébalo con `grep -rE "from '(@nestjs|mongoose|typeorm|express|class-validator)" --include=*.ts apps libs src | grep /dominio/`.
5. **Errores:** se usa `Either` en el dominio y la aplicación, y la pasarela traduce todos los errores posibles a HTTP.
6. **Microservicios:** los contratos están en `libs/contratos`, los consumidores son idempotentes, ningún servicio importa código de otro y los eventos se publican después de guardar.
7. **Multi-tenant y seguridad:** se filtra por `gestorId` sacado del token, hay una prueba de aislamiento entre gestores, roles en todos los endpoints, sin secretos en el código ni datos personales en los logs.
8. **API:** DTO con la convención de nombres, `Location` en 201, OpenAPI, `request/*.rest` y `scripts/comprobar-api.sh`.
9. **Calidad:** sin `console.log`, `eslint-disable` sin motivo, `.only` o `skip`, código comentado ni `TODO` sin issue.
10. **Alcance:** nada fuera de la historia ni del MVP.

## Resultado

- Si todo está ✅, indica que está listo para PR y recuerda la declaración de uso de IA.
- Si algo está ❌, propón el arreglo concreto y pregunta si lo aplicas.
