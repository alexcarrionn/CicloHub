import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { opcionesServidorNats, SERVICIOS } from '@app/contratos';
import { IncidenciasModule } from './incidencias.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    IncidenciasModule,
    opcionesServidorNats(SERVICIOS.INCIDENCIAS),
  );
  await app.listen();
}
// Si no arranca (por ejemplo, porque NATS no está disponible), se registra el
// error y el proceso termina con código de error para que el orquestador lo
// reinicie.
bootstrap().catch((error: unknown) => {
  new Logger('Arranque').error(
    'No se ha podido arrancar el microservicio de incidencias',
    error,
  );
  process.exitCode = 1;
});
