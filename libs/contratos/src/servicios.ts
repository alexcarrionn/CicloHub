/**
 * Nombres de los microservicios de CicloHub. Se usan como prefijo de los
 * patrones de mensaje y como nombre de la cola de NATS de cada servicio.
 */
export const SERVICIOS = {
  USUARIOS: 'usuarios',
  ESTACIONES_BICI: 'estaciones-bici',
  PRESTAMOS: 'prestamos',
  INCIDENCIAS: 'incidencias',
  ESTADISTICAS: 'estadisticas',
} as const;

export type NombreServicio = (typeof SERVICIOS)[keyof typeof SERVICIOS];
