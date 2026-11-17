---
name: Informe de bug
about: Reporta un fallo en la aplicación
title: "[BUG] "
labels: ["bug", "triage"]
assignees: ["alexcarrionn"]
---

## Descripción
<!-- Qué ocurre. -->

## Pasos para reproducir
1.
2.

## Comportamiento esperado

## Comportamiento actual
<!-- Petición curl, código HTTP y respuesta devuelta. -->
```shell
curl -i http://localhost:3000/

HTTP/1.1 500
{"statusCode": 500, "message": "..."}
```

## Logs
<!-- Salida relevante de la consola de la aplicación (opcional). -->
```shell

```

## Entorno
- Versión de Node.js (`node -v`):
- Ejecución: [ ] `npm run start:dev`  [ ] Docker Compose  [ ] Imagen de GHCR (indica la etiqueta)
- Versión o commit (`git rev-parse --short HEAD`):
