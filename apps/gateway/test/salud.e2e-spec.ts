import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import request from 'supertest';
import { App } from 'supertest/types';
import { CLIENTE_NATS } from '@app/contratos';
import { GatewayModule } from '../src/gateway.module';

describe('Pasarela: salud (pruebas backend)', () => {
  let app: INestApplication<App>;
  const nats = { send: jest.fn(() => of({ estado: 'ok' })), close: jest.fn() };

  beforeEach(async () => {
    // NATS se sustituye por un doble: estas pruebas no necesitan el broker.
    const modulo = await Test.createTestingModule({
      imports: [GatewayModule],
    })
      .overrideProvider(CLIENTE_NATS)
      .useValue(nats)
      .compile();

    app = modulo.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /salud responde 200', () =>
    request(app.getHttpServer())
      .get('/salud')
      .expect(200)
      .expect({ servicio: 'gateway', estado: 'ok' }));

  it('GET /salud/servicios responde 200 cuando todos los servicios contestan', () =>
    request(app.getHttpServer())
      .get('/salud/servicios')
      .expect(200)
      .expect(({ body }: { body: { estado: string }[] }) => {
        expect(body).toHaveLength(5);
        expect(body.every(({ estado }) => estado === 'ok')).toBe(true);
      }));

  it('una ruta desconocida devuelve 404', () =>
    request(app.getHttpServer()).get('/no-existe').expect(404));
});
