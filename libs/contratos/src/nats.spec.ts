import { Transport } from '@nestjs/microservices';
import { opcionesClienteNats, opcionesServidorNats } from './nats';
import { SERVICIOS } from './servicios';

describe('opciones de NATS', () => {
  const urlOriginal = process.env.NATS_URL;

  afterEach(() => {
    if (urlOriginal === undefined) delete process.env.NATS_URL;
    else process.env.NATS_URL = urlOriginal;
  });

  it('usa NATS_URL cuando está definida', () => {
    process.env.NATS_URL = 'nats://nats:4222';
    expect(opcionesClienteNats().options?.servers).toEqual([
      'nats://nats:4222',
    ]);
  });

  it('usa el NATS local cuando NATS_URL no está definida', () => {
    delete process.env.NATS_URL;
    expect(opcionesClienteNats().options?.servers).toEqual([
      'nats://localhost:4222',
    ]);
  });

  it('el servidor de un microservicio escucha en la cola de su servicio', () => {
    const opciones = opcionesServidorNats(SERVICIOS.INCIDENCIAS);
    expect(opciones.transport).toBe(Transport.NATS);
    expect(opciones.options?.queue).toBe('incidencias');
  });
});
