// Importando modulos comuns do nestJs e decorator responsável por liberar este modulo globalmente
import { Module, Global } from '@nestjs/common';
// Importando serviço do logger
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})

export class LoggerModule {}
