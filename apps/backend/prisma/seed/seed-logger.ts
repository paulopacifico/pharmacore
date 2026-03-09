type SeedLogLevel = 'INFO' | 'WARN' | 'ERROR';

type SeedLogMeta = Record<string, string | number | boolean | null | undefined>;

function serializeMeta(meta?: SeedLogMeta): string {
  if (!meta) {
    return '';
  }

  const entries = Object.entries(meta).filter(
    ([, value]) => value !== undefined,
  );
  if (!entries.length) {
    return '';
  }

  const payload = entries
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(' ');

  return ` | ${payload}`;
}

export class SeedLogger {
  constructor(private readonly scope: string) {}

  private write(
    level: SeedLogLevel,
    message: string,
    meta?: SeedLogMeta,
  ): void {
    const timestamp = new Date().toISOString();
    const line = `[seed:${this.scope}] [${timestamp}] [${level}] ${message}${serializeMeta(meta)}`;
    console.log(line);
  }

  info(message: string, meta?: SeedLogMeta): void {
    this.write('INFO', message, meta);
  }

  warn(message: string, meta?: SeedLogMeta): void {
    this.write('WARN', message, meta);
  }

  error(message: string, meta?: SeedLogMeta): void {
    this.write('ERROR', message, meta);
  }

  progress(
    label: string,
    current: number,
    total: number,
    meta?: SeedLogMeta,
  ): void {
    const percent = total > 0 ? ((current / total) * 100).toFixed(2) : '100.00';
    this.info(`${label}: ${current}/${total} (${percent}%)`, meta);
  }
}
