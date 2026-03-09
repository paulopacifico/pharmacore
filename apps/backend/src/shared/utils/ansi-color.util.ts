export enum AnsiColor {
  GRAY = '\x1b[90m',
  CYAN = '\x1b[36m',
  GREEN = '\x1b[32m',
  YELLOW = '\x1b[33m',
  RED = '\x1b[31m',
  MAGENTA = '\x1b[35m',
}

export class AnsiColorUtil {
  private static readonly RESET = '\x1b[0m';

  static color(text: string, color: AnsiColor): string {
    return `${color}${text}${this.RESET}`;
  }

  static info(text: string): string {
    return this.color(text, AnsiColor.CYAN);
  }

  static success(text: string): string {
    return this.color(text, AnsiColor.GREEN);
  }

  static warn(text: string): string {
    return this.color(text, AnsiColor.YELLOW);
  }

  static error(text: string): string {
    return this.color(text, AnsiColor.RED);
  }

  static muted(text: string): string {
    return this.color(text, AnsiColor.GRAY);
  }

  static resolveMethodColor(method?: string): AnsiColor {
    switch ((method ?? '').toUpperCase()) {
      case 'GET':
        return AnsiColor.CYAN;
      case 'POST':
        return AnsiColor.GREEN;
      case 'PUT':
      case 'PATCH':
        return AnsiColor.YELLOW;
      case 'DELETE':
        return AnsiColor.RED;
      default:
        return AnsiColor.MAGENTA;
    }
  }

  static resolveStatusColor(statusCode?: number | null): AnsiColor {
    if (!statusCode) return AnsiColor.GRAY;
    if (statusCode >= 500) return AnsiColor.RED;
    if (statusCode >= 400) return AnsiColor.YELLOW;
    if (statusCode >= 300) return AnsiColor.CYAN;
    return AnsiColor.GREEN;
  }

  static resolveDurationColor(durationMs: number): AnsiColor {
    if (durationMs >= 1000) return AnsiColor.RED;
    if (durationMs >= 300) return AnsiColor.YELLOW;
    return AnsiColor.GREEN;
  }
}
