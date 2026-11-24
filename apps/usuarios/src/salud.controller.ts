import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import type { RespuestaSalud } from '@app/contratos';
import { patronSalud, SERVICIOS } from '@app/contratos';

/** Responde a la comprobación de salud que la pasarela envía por NATS. */
@Controller()
export class SaludController {
  @MessagePattern(patronSalud(SERVICIOS.USUARIOS))
  comprobar(): RespuestaSalud {
    return { servicio: SERVICIOS.USUARIOS, estado: 'ok' };
  }
}
