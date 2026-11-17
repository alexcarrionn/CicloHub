# Guía de Contribución

¡Gracias por querer colaborar en CicloHub! Este repositorio contiene el trabajo común del Máster de Ingeniería del Software de la Universidad de Murcia (grupo 3): una API en **TypeScript** sobre **NestJS**.

---

## 1. Requisitos del entorno

| Herramienta | Versión requerida | Comprobación |
|-------------|-------------------|--------------|
| **Git**     | Versión reciente  | `git --version` |
| **Node.js** | **22 LTS**        | `node -v` |
| **npm**     | 10+               | `npm -v` |
| **Docker**  | Cualquiera reciente (opcional) | `docker compose version` |

> Si usas `nvm`, basta con `nvm use` en la raíz del repositorio: el fichero `.nvmrc` fija la versión.

Instalación de dependencias y primer arranque:

```bash
npm ci              # instala exactamente lo que fija package-lock.json
npm run start:dev   # arranca en modo desarrollo con recarga automática
```

La API queda escuchando en `http://localhost:3000`. Comprueba que responde:

```bash
curl http://localhost:3000/
# Hello World!
```

También puedes levantarla en contenedor, que es como se ejecuta en producción:

```bash
docker compose up --build
```

---

## 2. Configuración inicial del repositorio

Los hooks de Git versionados garantizan que ningún commit entre sin formatear y sin pasar el linter. **Se activan solos al ejecutar `npm ci`** (o `npm install`): el script `prepare` de `package.json` apunta `core.hooksPath` a `.githooks`.

```bash
npm ci

# Solo en Linux/macOS, si el commit avisa de que el hook no es ejecutable
chmod +x .githooks/pre-commit
```

> Los hooks viven normalmente en `.git/hooks/`, que **no se versiona**. Por eso los guardamos en `.githooks/` y apuntamos `core.hooksPath` ahí. El script `prepare` solo lo hace si existe la carpeta `.git`, de modo que no afecta a la construcción de la imagen Docker.

### ¿Qué hace el hook `pre-commit`?

Ejecuta **Prettier** y **ESLint** con autocorrección sobre los ficheros en *staging* y los vuelve a indexar. Si queda algún error de lint que no se puede corregir solo, el commit se cancela.

Puedes lanzar lo mismo a mano en cualquier momento:

```bash
npm run format      # prettier --write
npm run lint        # eslint
npm run lint:fix    # eslint --fix
```

El hook local **no sustituye a la CI**: siempre se puede saltar con `git commit --no-verify`, y por eso el pipeline vuelve a comprobarlo.

---

## 3. Uso de Inteligencia Artificial (IA)

El uso de herramientas de asistencia basada en IA (ChatGPT, GitHub Copilot, Gemini, Claude, etc.) está permitido como apoyo al desarrollo, pero **su uso debe ser transparente y responsable**:

1. **Declaración obligatoria.** Si has utilizado IA para generar código, diseñar tests, redactar documentación o resolver incidencias, **debes declararlo en la descripción del Pull Request**, indicando la herramienta y el alcance de su intervención.
2. **Responsabilidad humana.** Quien envía el PR es responsable al 100 % del código aportado. Debes comprender cada línea generada, verificar que no introduce vulnerabilidades, malas prácticas ni dependencias innecesarias, y asegurar que cumple los estándares del proyecto.
3. **Validación estricta.** El código asistido por IA pasa exactamente las mismas pruebas y revisiones que el escrito a mano.

---

## 4. Flujo de trabajo con Git y GitHub

### 4.1. Reportar problemas o sugerencias (Issues)

Antes de empezar cualquier tarea de cierto alcance, abre o busca una Issue. Al crear una nueva, usa las plantillas disponibles en `.github/ISSUE_TEMPLATE/`:

* **Informe de bug** — para fallos de funcionamiento o regresiones.
* **Petición de funcionalidad** — para nuevas características o mejoras.
* **Tarea técnica** — refactorizaciones, dependencias, CI/CD o Docker.
* **Documentación** — errores o huecos en la documentación.

### 4.2. Ramas de trabajo

Crea una rama descriptiva a partir de `main`, con el formato `<tipo>/<número-issue>-<slug>`:

* `feat/123-alta-usuarios` — nueva funcionalidad.
* `fix/124-error-validacion` — corrección de un bug.
* `refactor/125-modulo-usuarios` — refactorización.
* `docs/126-guia-despliegue` — documentación.

Usa el número del issue que tienes asignado; el *slug* debe ser corto y descriptivo.

### 4.3. Convención de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(ámbito): descripción clara en imperativo
```

* **Tipos permitidos:** `feat`, `fix`, `docs`, `test`, `refactor`, `build`, `chore`, `ci`.
* **Ejemplos:**
  * `feat(usuarios): añade el alta de usuarios`
  * `fix(api): devuelve 400 cuando falta un campo obligatorio`
  * `test(usuarios): cubre el alta con correo duplicado`
  * `ci(release): publica la imagen en GHCR con etiquetas SemVer`

Los commits deben estar **firmados con el nombre de quien los realiza**. No se aceptan commits cuyo autor sea una herramienta de IA.

---

## 5. Estándares de desarrollo y pruebas

### 5.1. Arquitectura

Respeta la estructura estándar de NestJS: el código vive en `src/`, organizado en **módulos**, y cada módulo agrupa sus controladores, servicios y tests unitarios.

* **Los controladores solo hablan HTTP**: reciben la petición, delegan en un servicio y devuelven la respuesta.
* **La lógica de negocio vive en los servicios** (`*.service.ts`), sin dependencias de HTTP.
* Genera las piezas nuevas con la CLI de Nest (`npx nest generate module|controller|service <nombre>`) para mantener la estructura y los nombres homogéneos.

### 5.2. Pruebas

Toda contribución de código llega con tests. Sin excepciones.

| Tipo | Dónde | Qué comprueba |
|---|---|---|
| **Unitarios** | `src/**/*.spec.ts`, junto al código que prueban | Servicios y controladores, de forma aislada. |
| **e2e** | `test/*.e2e-spec.ts` | Que los endpoints responden lo esperado, con Supertest. |

```bash
npm test                # tests unitarios
npm run test:e2e        # tests e2e
npm run test:watch      # modo interactivo mientras desarrollas
npm run test:coverage   # informe de cobertura
```

Ejecútalos **antes** de abrir el PR. La CI los volverá a ejecutar, pero descubrirlo en local es más rápido.

Si añades un endpoint, añade también su comprobación en `scripts/comprobar-api.sh`: es la prueba de humo que la CI lanza contra la imagen Docker.

---

## 6. Envío y revisión de Pull Requests

### 6.1. Qué incluir

Completa todos los campos de la plantilla (`.github/PULL_REQUEST_TEMPLATE.md`):

* **Enlace a la Issue** correspondiente (`Closes #123`).
* **Resumen del cambio.**
* **Cómo lo has probado**: tests nuevos o actualizados, y comprobación manual con `curl`.
* **Declaración de uso de IA**, si la ha habido.
* **Notas para quien revise**: decisiones discutibles, alternativas descartadas, dudas.

### 6.2. Revisión

GitHub solicitará automáticamente la revisión de los propietarios definidos en `.github/CODEOWNERS`.

Si te piden cambios, súbelos como commits nuevos **a la misma rama**: el PR se actualiza solo y la CI se vuelve a ejecutar. No cierres el PR para abrir otro.

### 6.3. Criterios de aceptación

Un PR se fusiona cuando se cumple **todo** esto:

| Criterio | Cómo se comprueba |
|---|---|
| El pipeline de CI está en verde | Checks `lint`, `test`, `build` y `docker` |
| El código cumple el estilo | `npm run lint` y `npm run format:check` |
| La batería de tests pasa | `npm test` y `npm run test:e2e` |
| Hay tests que cubren el cambio | Revisión manual |
| Al menos una aprobación de un *code owner* | Revisión en GitHub |
| No quedan conversaciones sin resolver | Revisión en GitHub |
| La rama está actualizada respecto a `main` | GitHub lo exige antes de fusionar |

### 6.4. Política de fusión

* **Todo entra en `main` por Pull Request**, sin push directo.
* **Estrategia: _Squash and merge_.** Todo el PR entra en `main` como **un único commit**, cuyo mensaje debe seguir Conventional Commits. Mantiene el historial de `main` legible y evita que se cuelen commits intermedios del tipo "arreglo" o "ahora sí".
* **La rama se borra tras la fusión.**
* Si `main` ha avanzado y tu rama se queda atrás, actualízala con **rebase** y sube con `git push --force-with-lease`:

  ```bash
  git fetch origin
  git rebase origin/main
  # resolver conflictos si los hay
  git push --force-with-lease
  ```

  Usa `--force-with-lease` y no `--force`: aborta el push si alguien ha subido algo a tu rama mientras tanto, en lugar de pisarlo.

---

## 7. Dónde preguntar

Comenta en el issue correspondiente, o abre uno nuevo si no existe.

Gracias por contribuir.
