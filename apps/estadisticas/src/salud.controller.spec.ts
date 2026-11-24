import { Test } from '@nestjs/testing';
import { SaludController } from './salud.controller';
import { EstadisticasModule } from './estadisticas.module';

describe('SaludController de estadísticas', () => {
  it('responde que el servicio estadisticas está en marcha', async () => {
    // Se compila el módulo completo para comprobar también su configuración.
    const modulo = await Test.createTestingModule({
      imports: [EstadisticasModule],
    }).compile();

    expect(modulo.get(SaludController).comprobar()).toEqual({
      servicio: 'estadisticas',
      estado: 'ok',
    });
  });
});
