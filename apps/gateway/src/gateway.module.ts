import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CLIENTE_NATS, opcionesClienteNats } from '@app/contratos';
import { SaludController } from './salud/salud.controller';

/**
 * Pasarela de API: la única app que escucha HTTP desde fuera. Traduce cada
 * petición a un mensaje de NATS para el microservicio que corresponda.
 */
@Module({
  imports: [
    ClientsModule.register([{ name: CLIENTE_NATS, ...opcionesClienteNats() }]),
  ],
  controllers: [SaludController],
})
export class GatewayModule {}
