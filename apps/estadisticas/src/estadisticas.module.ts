import { Module } from '@nestjs/common';
import { SaludController } from './salud.controller';

/**
 * Microservicio de estadísticas. Cada contexto del dominio se añade como un
 * módulo propio en `src/<contexto>/` (ver la skill `nuevo-contexto`).
 */
@Module({
  controllers: [SaludController],
})
export class EstadisticasModule {}
