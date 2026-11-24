import { NombreServicio } from './servicios';

/** Respuesta de la comprobación de salud de la pasarela o de un servicio. */
export interface RespuestaSalud {
  servicio: NombreServicio | 'gateway';
  estado: 'ok';
}

/**
 * Patrón del mensaje de salud de cada servicio (`<servicio>.salud`). Cada
 * servicio tiene el suyo para que la pasarela sepa quién responde.
 */
export function patronSalud(servicio: NombreServicio): string {
  return `${servicio}.salud`;
}
