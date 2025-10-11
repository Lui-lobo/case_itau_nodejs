// Importando modulso comuns do nest
import { Injectable, NestMiddleware } from '@nestjs/common';
// Importando gerador de UUIDs para gerar IDs de logs
import { randomUUID } from 'crypto';
// Importando serviço do logger
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const requestId = randomUUID();
    req.requestId = requestId;
    LoggerService.setRequestId(requestId);
    next();
  }
}
