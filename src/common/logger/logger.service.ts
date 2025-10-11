import { Injectable, Logger, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable({ scope: Scope.DEFAULT })
export class LoggerService {
  private readonly logger = new Logger('App');
  private static als = new AsyncLocalStorage<Map<string, string>>();

  // ========== CONTEXTO DE REQUEST ==========
  static setRequestId(requestId: string) {
    const store = new Map<string, string>();
    store.set('requestId', requestId);
    LoggerService.als.enterWith(store);
  }

  static getRequestId(): string | undefined {
    return LoggerService.als.getStore()?.get('requestId');
  }

  // ========== FORMATADOR DE MENSAGEM ==========
  public format(message: string, context?: string): string {
    const reqId = LoggerService.getRequestId();
    const reqPart = reqId ? `[req:${reqId}]` : '';
    const ctxPart = context ? `[${context}]` : '[App]';
    return `${reqPart}${ctxPart} ${message}`;
  }

  // ========== MÉTODOS DE LOG ==========
  log(message: string, context?: string) {
    this.logger.log(this.format(message, context));
  }

  warn(message: string, context?: string) {
    this.logger.warn(this.format(message, context));
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(this.format(message, context), trace);
  }

  debug(message: string, context?: string) {
    this.logger.debug(this.format(message, context));
  }

  // Método padronizado para logs de operações
  track(operation: string, data?: Record<string, any>, context?: string) {
    const payload =
      typeof data === 'object' && data !== null
        ? JSON.stringify(data)
        : String(data ?? '');
    this.logger.log(this.format(`${operation} ${payload}`, context ?? operation));
  }
}
