import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import type { NombreServicio, RespuestaSalud } from '@app/contratos';
import { CLIENTE_NATS, patronSalud, SERVICIOS } from '@app/contratos';

/** Milisegundos que se espera la respuesta de cada servicio. */
export const ESPERA_SALUD_MS = 2000;

export interface EstadoServicio {
  servicio: NombreServicio;
  estado: 'ok' | 'sin respuesta';
}

@Controller('salud')
export class SaludController {
  constructor(@Inject(CLIENTE_NATS) private readonly nats: ClientProxy) {}

  /**
   * Comprobación de vida de la pasarela. No depende de NATS, así que la
   * pueden usar el HEALTHCHECK de Docker y el balanceador.
   */
  @Get()
  comprobar(): RespuestaSalud {
    return { servicio: 'gateway', estado: 'ok' };
  }

  /**
   * Pregunta por NATS a cada microservicio si está en marcha. Devuelve 503
   * si alguno no responde a tiempo.
   */
  @Get('servicios')
  async comprobarServicios(): Promise<EstadoServicio[]> {
    const estados = await Promise.all(
      Object.values(SERVICIOS).map((servicio) => this.preguntar(servicio)),
    );
    if (estados.some(({ estado }) => estado !== 'ok')) {
      throw new ServiceUnavailableException(estados);
    }
    return estados;
  }

  private async preguntar(servicio: NombreServicio): Promise<EstadoServicio> {
    try {
      await firstValueFrom(
        this.nats
          .send<RespuestaSalud>(patronSalud(servicio), {})
          .pipe(timeout(ESPERA_SALUD_MS)),
      );
      return { servicio, estado: 'ok' };
    } catch {
      return { servicio, estado: 'sin respuesta' };
    }
  }
}
