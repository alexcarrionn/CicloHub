# Dominio de CicloHub

Fuente: enunciado definitivo del caso de estudio (MISUM 2026/27). Las dudas de interpretación se consultan con los profesores, así que **no inventes reglas**. Si algo no aparece aquí, pregunta.

## Actores

| Rol | Puede |
|---|---|
| **Gestor** (ayuntamiento, entidad urbanística…) | Contratar un plan; dar de baja y consultar usuarios; obtener códigos de activación; dar de alta, cerrar y dar de baja estaciones; dar de alta y de baja bicicletas; dar de alta y de baja operarios; asignar incidencias; reactivar usuarios bloqueados; configurar límites de uso y tiempo de reserva; cerrar incidencias. |
| **Usuario** | Completar su alta con código; ver bicis cercanas; reservar, cancelar, alquilar y devolver; avisar de estación llena; reportar incidencias; pedir su reactivación; consultar su historial y su situación. |
| **Operario** | Registrar incidencias y asignárselas; resolverlas o marcarlas como pendientes de baja; trasladar bicis entre estaciones; actualizar los anclajes disponibles de una estación. |

## Multi-tenant

Una única instancia da servicio a todos los gestores. **Cada gestor maneja sus usuarios, estaciones, bicicletas, alquileres e incidencias sin acceder a los de otros.** Todo agregado de un gestor lleva su `gestorId`.

## Planes de suscripción (del gestor)

- **Básico:** máximo **10 estaciones** y **100 bicicletas** en total. Cada estación tiene 10 puntos de anclaje.
- **Premium:** sin límite de estaciones ni de bicicletas.

Dar de alta una estación o una bici por encima del límite del plan es un error de dominio.

## Usuarios y alta

- El gestor valida la solicitud **fuera de la aplicación**. Una vez aceptada, CicloHub le da un **código de activación**, y el gestor se lo entrega al usuario. La aplicación no lo envía.
- El usuario completa el alta con el código e introduce: **email, fecha de nacimiento, teléfono, y nombre y apellidos**.
- El gestor puede **dar de baja** y **consultar** usuarios.

## Estaciones

- Datos: **coordenadas geográficas, dirección y capacidad** (número de puntos de anclaje).
- Se pueden **cerrar temporalmente** y **dar de baja**, en los dos casos **solo si están vacías**.
- Un operario puede actualizar el número de **anclajes disponibles** cuando hay reparaciones.
- Cuando una estación está **llena**, se notifica una incidencia al gestor.

## Bicicletas

- Datos: **código único**, **modelo**, **fecha de alta** y, si procede, **fecha de baja y motivo**.
- Se guarda el **histórico de todas las estaciones** por las que pasa la bici, porque se puede devolver en otra distinta.
- Estados que se deducen del enunciado: disponible, reservada, alquilada, no disponible (con incidencia) y de baja. Confirmad el modelo de estados con el equipo antes de fijarlo.

## Alquiler

- Solo se alquilan **bicis disponibles** en una estación.
- Se respetan los **límites de uso diarios y semanales** que fija cada gestor (por ejemplo, 1 hora al día o 3 a la semana).
- Se registran la **fecha y hora de inicio** y la de **fin**, al aparcarla.
- **No se puede alquilar con otro alquiler activo** (una bici sin devolver).
- **Un usuario bloqueado no puede alquilar.**
- **Estación llena al devolver:** el usuario lo notifica, se le dan **2 horas extra** de alquiler y se notifica una incidencia al gestor.
- El usuario puede consultar las **bicis cercanas a su ubicación actual**.

## Reserva

- Se reserva una bici disponible durante el **tiempo máximo que fija el gestor** (por ejemplo, 30 minutos). Mientras dure, la bici queda apartada para ese usuario.
- Se puede **iniciar el alquiler** antes de que termine el plazo.
- Se puede **cancelar** en cualquier momento: la bici vuelve a estar disponible y la reserva **no cuenta como caducada**.
- **No se puede reservar** si el usuario ya tiene otra reserva activa o está bloqueado.

## Bloqueo de usuarios

- Causas: acumular **3 reservas caducadas** o **superar los límites de uso**.
- **Se registra el motivo** del bloqueo.
- Un usuario bloqueado no puede reservar ni alquilar.
- El usuario **pide la reactivación desde la app** y el **gestor** la concede.

## Incidencias

- Cualquier usuario registra una incidencia sobre una **bicicleta** o sobre un **punto de anclaje** de una estación.
- Al crearse: estado **«pendiente»**, con **fecha de creación** y **descripción**. Si es de una bici, la bici pasa a **no disponible**.
- El gestor la **asigna a un operario**. El operario también puede registrar incidencias y asignárselas.
- Al terminar, el operario la marca como:
  - **«resuelta»**: la bici vuelve a estar disponible.
  - **«pendiente de baja»**, con el motivo justificado. Después el **gestor** da de baja la bici y **cierra** la incidencia.
- También se generan incidencias automáticas al gestor cuando una estación está llena.

## Historial y estadísticas

- **El usuario** ve su historial de alquileres y reservas, con **gráficas y estadísticas** de sus hábitos, su situación (si está bloqueado y su uso diario y semanal) y sus incidencias.
- Hay información sobre la **ocupación media de las estaciones por franjas horarias**.

## Requisitos no funcionales

- Interfaz en **español e inglés** desde la primera versión. La API devuelve **códigos de error** que el front traduce.
- **Disponible 24x7 desde el primer día.**
- Accesibilidad **WCAG 2.2 AA**.
- Programación segura según el **OWASP Top 10** más reciente y gestión de riesgos durante el desarrollo.
- Mecanismos técnicos que faciliten cumplir la **LOPD y el RGPD** (ver `seguridad-rgpd.md`).

## Fuera del MVP

- **Ubicación en tiempo real de las bicis:** es de la **versión 2**. Por privacidad, solo se verán las bicis **no devueltas en plazo**. No la implementes en el MVP.
- Cobros a usuarios, hardware de estaciones e integración con otros transportes: el enunciado no los menciona, así que no se implementan.
