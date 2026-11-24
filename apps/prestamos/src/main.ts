import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { opcionesServidorNats, SERVICIOS } from '@app/contratos';
import { PrestamosModule } from './prestamos.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PrestamosModule,
    opcionesServidorNats(SERVICIOS.PRESTAMOS),
  );
  await app.listen();
}
// Si no arranca (por ejemplo, porque NATS no está disponible), se registra el
// error y el proceso termina con código de error para que el orquestador lo
// reinicie.
bootstrap().catch((error: unknown) => {
  new Logger('Arranque').error(
    'No se ha podido arrancar el microservicio de préstamos',
    error,
  );
  process.exitCode = 1;
});
