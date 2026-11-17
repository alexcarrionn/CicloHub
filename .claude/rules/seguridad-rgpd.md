# Seguridad, riesgos y protección de datos

Fuente: enunciado. Exige programación segura según el **OWASP Top 10 más reciente** y sus mitigaciones, **gestión de riesgos** en el ciclo de desarrollo, **OAuth2** para autenticar, **JWT** para el control de acceso, y **mecanismos técnicos que faciliten cumplir la LOPD y el RGPD**. La visión técnica de la seguridad es de la optativa DDSS. Si llega material suyo, se incorporará aquí.

## Autenticación y control de acceso (OWASP A01 y A07)

- La autenticación usa **OAuth2**. El proveedor es una decisión pendiente (ver `CLAUDE.md`). No elijas uno por tu cuenta.
- La **pasarela valida el JWT** (firma, caducidad, emisor y audiencia) y saca de él el usuario, el rol y el `gestorId`. No se aceptan tokens sin firmar ni algoritmos débiles.
- Todo endpoint exige autenticación, salvo los públicos indicados expresamente (salud, completar el alta con código).
- La autorización por rol (gestor, usuario, operario) va en un guard y un decorador (`@Roles(...)`), no con `if` repartidos.
- **Aislamiento entre gestores:** el `gestorId` sale **siempre del token**. Un usuario solo ve sus propios datos (historial, reservas, incidencias), y un operario solo los de su gestor. Debe haber pruebas de que un gestor **no** puede leer ni modificar datos de otro.
- Si el recurso es de otro gestor, se responde 404 sin revelar que existe.

## Entrada, datos y configuración (A02, A03, A05, A06)

- Toda la entrada se valida (`ValidationPipe` con `whitelist`). Nunca se usa la entrada del cliente como filtro de una consulta sin validarla, para evitar inyección SQL o NoSQL.
- Los errores no exponen trazas ni detalles internos.
- El **código de activación** se genera con un generador criptográfico (`crypto`), es de un solo uso, caduca y está ligado a su gestor.
- Los secretos (claves de JWT y OAuth, URIs de base de datos) van en variables de entorno. Nunca en el código ni en el repo, y `.env.example` sin valores reales.
- Se usan `helmet`, CORS restringido a los orígenes del front y límite de peticiones en los endpoints sensibles (login y activación).
- Los contenedores no se ejecutan como root (la CI lo comprueba).
- No se añaden dependencias sin necesidad. Si añades una, justifícala para el PR.

## RGPD y LOPD: mecanismos técnicos

Los responsables del tratamiento son los gestores. La plataforma les da las herramientas:
- **Minimización:** del usuario solo se guarda lo que pide el enunciado para el alta (email, fecha de nacimiento, teléfono, nombre y apellidos) y lo que hace falta para el servicio.
- **Ubicación:** la ubicación actual del usuario (para buscar bicis cercanas) **no se guarda**. La localización de bicis en tiempo real es de la versión 2 y solo para bicis no devueltas en plazo.
- **Derechos del interesado:** la plataforma tiene que permitir el **acceso y la exportación** de sus datos, la **rectificación** y la **supresión**. Las estadísticas, como la ocupación por franjas, se calculan con datos **anonimizados**, de forma que la baja de un usuario no las rompa. Si una historia toca esto, pregunta cómo lo ha acordado el equipo.
- **Nada de datos personales en los logs** (email, teléfono, ubicación). En los logs van identificadores.
- Los DTO de respuesta solo exponen los datos personales necesarios para quien los pide.
- Las semillas y los datos de prueba son ficticios.

## Gestión de riesgos

Si al implementar algo ves un riesgo técnico (de seguridad, de disponibilidad 24x7, de consistencia entre microservicios o de privacidad), **dilo** en el resumen final para que el equipo lo incorpore al análisis de riesgos (entregable 2 de GAP).
