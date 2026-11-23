import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  await app.listen(process.env.PORT ?? 3000);
}
// En el nivel superior de un módulo CommonJS no se puede usar `await`, así
// que el fallo de arranque se gestiona aquí: se registra y el proceso
// termina con código de error para que el orquestador lo reinicie.
bootstrap().catch((error: unknown) => {
  new Logger('Arranque').error('No se ha podido arrancar la pasarela', error);
  process.exitCode = 1;
});
