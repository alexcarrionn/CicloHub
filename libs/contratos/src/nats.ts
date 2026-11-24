import { NatsOptions, Transport } from '@nestjs/microservices';
import { NombreServicio } from './servicios';

/** Token de inyección del cliente NATS que usa la pasarela. */
export const CLIENTE_NATS = 'CLIENTE_NATS';

const URL_NATS_POR_DEFECTO = 'nats://localhost:4222';

function servidoresNats(): string[] {
  return [process.env.NATS_URL ?? URL_NATS_POR_DEFECTO];
}

/**
 * Opciones con las que arranca un microservicio. La cola (`queue`) lleva el
 * nombre del servicio: si hay varias réplicas, NATS entrega cada mensaje a
 * una sola de ellas.
 */
export function opcionesServidorNats(servicio: NombreServicio): NatsOptions {
  return {
    transport: Transport.NATS,
    options: { servers: servidoresNats(), queue: servicio },
  };
}

/** Opciones del cliente NATS con el que la pasarela habla con los servicios. */
export function opcionesClienteNats(): NatsOptions {
  return {
    transport: Transport.NATS,
    options: { servers: servidoresNats() },
  };
}
