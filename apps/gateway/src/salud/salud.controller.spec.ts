import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NEVER, of } from 'rxjs';
import { CLIENTE_NATS, patronSalud, SERVICIOS } from '@app/contratos';
import { GatewayModule } from '../gateway.module';
import { ESPERA_SALUD_MS, SaludController } from './salud.controller';

describe('SaludController de la pasarela', () => {
  const nats = { send: jest.fn() };
  let controlador: SaludController;

  beforeEach(async () => {
    nats.send.mockReset();
    // Se compila el módulo de la pasarela con NATS sustituido por un doble.
    const modulo = await Test.createTestingModule({
      imports: [GatewayModule],
    })
      .overrideProvider(CLIENTE_NATS)
      .useValue(nats)
      .compile();
    controlador = modulo.get(SaludController);
  });

  it('GET /salud responde sin consultar a los microservicios', () => {
    expect(controlador.comprobar()).toEqual({
      servicio: 'gateway',
      estado: 'ok',
    });
    expect(nats.send).not.toHaveBeenCalled();
  });

  it('devuelve ok para todos los servicios cuando todos responden', async () => {
    nats.send.mockReturnValue(of({ estado: 'ok' }));

    const estados = await controlador.comprobarServicios();

    expect(estados).toEqual(
      Object.values(SERVICIOS).map((servicio) => ({
        servicio,
        estado: 'ok',
      })),
    );
    Object.values(SERVICIOS).forEach((servicio) =>
      expect(nats.send).toHaveBeenCalledWith(patronSalud(servicio), {}),
    );
  });

  it('lanza 503 si algún servicio no responde a tiempo', async () => {
    jest.useFakeTimers();
    nats.send.mockImplementation((patron: string) =>
      patron === patronSalud(SERVICIOS.PRESTAMOS) ? NEVER : of({}),
    );

    // La expectativa se engancha antes de avanzar el reloj para que el
    // rechazo no quede sin gestionar.
    const expectativa = expect(
      controlador.comprobarServicios(),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
    await jest.advanceTimersByTimeAsync(ESPERA_SALUD_MS);
    await expectativa;
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});
