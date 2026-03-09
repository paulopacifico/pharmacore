import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CreateAuditInDTO,
  CreateAuditUseCase,
  PermissionDTO,
  UserDTO,
} from '@pharmacore/auth';
import { Observable } from 'rxjs';
import { AuditPrisma } from 'src/auth/audit.prisma';
import { AnsiColorUtil } from '../utils/ansi-color.util';

@Injectable()
export class ActiveLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ActiveLogInterceptor.name);
  private readonly createAuditUseCase: CreateAuditUseCase;

  constructor(
    private readonly reflector: Reflector,
    private readonly auditPrisma: AuditPrisma,
  ) {
    this.createAuditUseCase = new CreateAuditUseCase(this.auditPrisma);
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const startedAt = Date.now();
    const http = context.switchToHttp();
    const req = http.getRequest<{
      method: string;
      originalUrl?: string;
      url?: string;
      ip?: string;
      socket?: { remoteAddress?: string };
      user?: UserDTO;
      body?: Record<string, unknown>;
    }>();
    const res = http.getResponse<{
      statusCode?: number;
      getHeader?: (name: string) => string | number | string[] | undefined;
      once?: (event: 'finish', listener: () => void) => void;
    }>();
    const requiredPermission =
      this.reflector.getAllAndOverride<PermissionDTO>('require-permission', [
        context.getHandler(),
        context.getClass(),
      ]) ?? null;

    res.once?.('finish', () => {
      const durationMs = Date.now() - startedAt;
      const endpoint = req.originalUrl ?? req.url ?? 'unknown';
      const user = req.user;
      const isLoginEndpoint = this.isLoginEndpoint(endpoint, req.method);
      const statusCode = res.statusCode ?? null;
      const responseSize = this.resolveResponseSize(res);
      const clientIp = req.ip ?? req.socket?.remoteAddress ?? '-';
      const durationLabel = `${durationMs.toFixed(2)}ms`;

      const line = `${AnsiColorUtil.color(req.method ?? '-', AnsiColorUtil.resolveMethodColor(req.method))} ${endpoint} ${AnsiColorUtil.muted('-')} ${AnsiColorUtil.color(String(statusCode ?? '-'), AnsiColorUtil.resolveStatusColor(statusCode))} ${responseSize} ${AnsiColorUtil.muted('from')} ${clientIp} ${AnsiColorUtil.muted('in')} ${AnsiColorUtil.color(durationLabel, AnsiColorUtil.resolveDurationColor(durationMs))}`;
      this.logger.log(line);

      const payload = this.buildAuditPayload({
        method: req.method,
        endpoint,
        body: req.body,
        user,
        requiredPermission,
        isLoginEndpoint,
        statusCode,
        durationMs,
      });

      void this.persistAudit(payload);
    });

    return next.handle();
  }

  private async persistAudit(payload: CreateAuditInDTO): Promise<void> {
    const result = await this.createAuditUseCase.execute(payload);
    if (result.isFailure) {
      const errors = result.errors?.join(',') ?? 'UNKNOWN_ERROR';
      const warnLine = `${AnsiColorUtil.muted('[AUDIT-WARN]')} Falha ao persistir auditoria: ${AnsiColorUtil.error(errors)}`;
      this.logger.log(warnLine);
    }
  }

  private extractAction(permissionAlias?: string, method?: string): string {
    if (permissionAlias) {
      const parts = permissionAlias.split('.');
      return (parts[2] ?? 'UNKNOWN').toUpperCase();
    }

    const byMethod: Record<string, string> = {
      GET: 'READ',
      POST: 'CREATE',
      PUT: 'UPDATE',
      PATCH: 'UPDATE',
      DELETE: 'DELETE',
    };

    return byMethod[method ?? ''] ?? 'UNKNOWN';
  }

  private resolveResponseSize(res: {
    getHeader?: (name: string) => string | number | string[] | undefined;
  }): string {
    const contentLength = res.getHeader?.('content-length');
    if (typeof contentLength === 'number') {
      return `${contentLength}B`;
    }
    if (typeof contentLength === 'string') {
      return `${contentLength}B`;
    }
    if (Array.isArray(contentLength) && contentLength.length > 0) {
      return `${contentLength.join(',')}B`;
    }
    return '-';
  }

  private isLoginEndpoint(endpoint: string, method?: string): boolean {
    return method?.toUpperCase() === 'POST' && endpoint.includes('/auth/login');
  }

  private extractAttemptedEmail(
    body?: Record<string, unknown>,
  ): string | null | undefined {
    const value = body?.email;
    if (typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    return normalized || null;
  }

  private buildAuditPayload(input: {
    method?: string;
    endpoint: string;
    body?: Record<string, unknown>;
    user?: UserDTO;
    requiredPermission: PermissionDTO | null;
    isLoginEndpoint: boolean;
    statusCode?: number | null;
    durationMs: number;
  }): CreateAuditInDTO {
    const attemptedEmail = this.extractAttemptedEmail(input.body);

    return {
      type: input.isLoginEndpoint ? 'auth_login_attempt' : 'user_activity',
      occurredAt: new Date(),
      method: (input.method ?? '').toUpperCase(),
      endpoint: input.endpoint,
      userId: input.user?.id ?? null,
      userEmail: input.user?.email ?? attemptedEmail,
      permissionId: input.requiredPermission?.id ?? null,
      permissionAlias: input.requiredPermission?.alias ?? null,
      action: input.isLoginEndpoint
        ? 'LOGIN'
        : this.extractAction(input.requiredPermission?.alias, input.method),
      criticality: input.requiredPermission?.criticality ?? 'N/A',
      statusCode: input.statusCode ?? null,
      durationMs: input.durationMs,
    };
  }
}
