import { Test } from '@nestjs/testing';
import { SaludController } from './salud.controller';
import { IncidenciasModule } from './incidencias.module';

describe('SaludController de incidencias', () => {
  it('responde que el servicio incidencias está en marcha', async () => {
    // Se compila el módulo completo para comprobar también su configuración.
    const modulo = await Test.createTestingModule({
      imports: [IncidenciasModule],
    }).compile();

    expect(modulo.get(SaludController).comprobar()).toEqual({
      servicio: 'incidencias',
      estado: 'ok',
    });
  });
});
