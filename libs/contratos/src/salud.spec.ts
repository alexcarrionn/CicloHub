import { patronSalud } from './salud';
import { SERVICIOS } from './servicios';

describe('patronSalud', () => {
  it('antepone el nombre del servicio al patrón de salud', () => {
    expect(patronSalud(SERVICIOS.PRESTAMOS)).toBe('prestamos.salud');
  });

  it('da un patrón distinto a cada servicio', () => {
    const patrones = Object.values(SERVICIOS).map(patronSalud);
    expect(new Set(patrones).size).toBe(patrones.length);
  });
});
