import { Test } from '@nestjs/testing';
import { SaludController } from './salud.controller';
import { UsuariosModule } from './usuarios.module';

describe('SaludController de usuarios', () => {
  it('responde que el servicio usuarios está en marcha', async () => {
    // Se compila el módulo completo para comprobar también su configuración.
    const modulo = await Test.createTestingModule({
      imports: [UsuariosModule],
    }).compile();

    expect(modulo.get(SaludController).comprobar()).toEqual({
      servicio: 'usuarios',
      estado: 'ok',
    });
  });
});
