# Documentación

En esta carpeta va la documentación del proyecto que no cabe en el `README.md` de la raíz: decisiones de diseño, guías y descripciones de los módulos.

- Cada documento es un fichero Markdown: `docs/<tema>.md`.
- `docs/site/` **no se versiona**: lo genera `npm run docs` (TypeDoc) a partir del código de `src/`, y el workflow `pages.yml` lo publica en GitHub Pages.
