# Calidad de código

Fuentes: enunciado (sección 3.4) y CCPS (sesión 1 de SonarQube, sesión 2 de Clean Code con ESLint y Prettier, y tema 2 de estrategia estática).

## Herramientas

- **ESLint con la guía de estilo de Airbnb** es lo que exige el enunciado, con la configuración adaptada al proyecto y **justificando cada decisión** (por ejemplo, reglas que se desactivan porque chocan con los decoradores de NestJS).
  - **Estado actual:** `eslint.config.mjs` es todavía el de NestJS por defecto (`typescript-eslint` `recommendedTypeChecked` + Prettier). La migración a Airbnb es una tarea pendiente. **No la hagas por tu cuenta** dentro de otra tarea.
  - Cuando se migre, cada regla desactivada o modificada lleva un comentario con su justificación, que va al informe de CCPS.
- **Prettier** decide el formato según `.prettierrc`. Las reglas de formato no se duplican en ESLint (`eslint-config-prettier`).
- **SonarQube** se usa para el análisis de calidad: problemas, *code smells*, duplicación, deuda técnica y cobertura (a partir del `lcov` de Jest). La configuración irá en `sonar-project.properties` cuando se monte. Los resultados del producto final se interpretan en el informe de CCPS.
- Si ESLint dice *"File ignored because no matching configuration was supplied"* sobre ficheros `.ts`, avisa: un lint que no revisa nada pasa siempre.

## Reglas

- **No desactives reglas** para que pase el lint. Si de verdad hace falta: `// eslint-disable-next-line <regla> -- <motivo>`, y explícaselo a la persona.
- Evita `any`: usa interfaces o `unknown` con comprobación de tipo.
- `const` por defecto, `let` solo si se reasigna, nunca `var`. Plantillas de texto en vez de concatenar, spread en vez de `Object.assign`, `===` siempre.
- Nada de `console.log`: usa el `Logger` de Nest.
- Todas las promesas se esperan o se devuelven.

## Clean Code

- Nombres que revelen la intención, en español y con el lenguaje del dominio. Nada de `data`, `info`, `tmp` ni `aux`.
- Funciones cortas que hacen una sola cosa. Una complejidad ciclomática alta es un aviso de SonarQube y además multiplica los caminos que hay que probar.
- A partir de 3 parámetros, usa un objeto de props tipado.
- Sin números mágicos: los límites del plan (10 estaciones, 100 bicis), las 3 reservas caducadas y las 2 horas extra son constantes con nombre del dominio.
- Sin código muerto ni comentado. Los comentarios explican el porqué. JSDoc en los puertos y los DTO públicos.
- Sin duplicación: si la misma lógica aparece en dos sitios, llévala a `libs/shared`.

## Deuda técnica

Si dejas algo pendiente, dilo en el resumen y propón el texto de una issue de tipo «Tarea técnica». Nada de `TODO` sin issue.
