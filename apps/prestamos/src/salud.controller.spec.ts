import { Test } from '@nestjs/testing';
import { SaludController } from './salud.controller';
import { PrestamosModule } from './prestamos.module';

describe('SaludController de préstamos', () => {
  it('responde que el servicio prestamos está en marcha', async () => {
    // Se compila el módulo completo para comprobar también su configuración.
    const modulo = await Test.createTestingModule({
      imports: [PrestamosModule],
    }).compile();

    expect(modulo.get(SaludController).comprobar()).toEqual({
      servicio: 'prestamos',
      estado: 'ok',
    });
  });
});
