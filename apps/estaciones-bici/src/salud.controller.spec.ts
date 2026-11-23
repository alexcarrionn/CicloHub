import { Test } from '@nestjs/testing';
import { SaludController } from './salud.controller';
import { EstacionesBiciModule } from './estaciones-bici.module';

describe('SaludController de estaciones y bicicletas', () => {
  it('responde que el servicio estaciones-bici está en marcha', async () => {
    // Se compila el módulo completo para comprobar también su configuración.
    const modulo = await Test.createTestingModule({
      imports: [EstacionesBiciModule],
    }).compile();

    expect(modulo.get(SaludController).comprobar()).toEqual({
      servicio: 'estaciones-bici',
      estado: 'ok',
    });
  });
});
