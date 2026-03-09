import * as bcrypt from 'bcrypt';
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { PermissionDTO, PERMISSIONS } from '@pharmacore/auth';
import { PrismaClient } from '../generated/prisma/client';
import { SeedLogger } from './seed-logger';

type RoleSeedItem = {
  name: string;
  description: string;
  permissionRefs: string[];
};

type RolesSeedFile = {
  total: number;
  items: RoleSeedItem[];
};

type UserSeedItem = {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  roles: string[];
};

type UsersSeedFile = {
  total: number;
  items: UserSeedItem[];
};

type AuditEventSeedItem = {
  name: string;
  type: string;
  method: string;
  endpoint: string;
  action: string;
  criticality: string;
  permissionAlias?: string | null;
  statusCodes: number[];
  durationMin: number;
  durationMax: number;
  weight: number;
  anonymous: boolean;
};

type AuditEventsSeedFile = {
  baseDate?: string;
  useCurrentDate?: boolean;
  daysBack: number;
  eventsPerDay: number;
  anonymousLoginEmails: string[];
  items: AuditEventSeedItem[];
};

type AuthSeedStats = {
  permissions: number;
  rolesCreated: number;
  rolesUpdated: number;
  usersCreated: number;
  usersUpdated: number;
  usersSkipped: number;
  passwordsCreated: number;
  auditEventsCreated: number;
};

const DATA_DIR = path.resolve(__dirname, 'data/auth');
const ROLES_FILE = path.join(DATA_DIR, 'roles.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const AUDIT_EVENTS_FILE = path.join(DATA_DIR, 'audit-events.json');
const PERMISSION_PROGRESS_EVERY = 20;
const ROLE_PROGRESS_EVERY = 10;
const USER_PROGRESS_EVERY = 10;
const AUDIT_BATCH_SIZE = 500;
const HOUR_WEIGHTS: Array<{ hour: number; weight: number }> = [
  { hour: 6, weight: 1 },
  { hour: 7, weight: 2 },
  { hour: 8, weight: 5 },
  { hour: 9, weight: 9 },
  { hour: 10, weight: 10 },
  { hour: 11, weight: 8 },
  { hour: 12, weight: 4 },
  { hour: 13, weight: 5 },
  { hour: 14, weight: 9 },
  { hour: 15, weight: 8 },
  { hour: 16, weight: 7 },
  { hour: 17, weight: 7 },
  { hour: 18, weight: 10 },
  { hour: 19, weight: 8 },
  { hour: 20, weight: 5 },
  { hour: 21, weight: 3 },
  { hour: 22, weight: 2 },
  { hour: 23, weight: 1 },
];

async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

function hasDelegate(client: unknown, delegateName: string): boolean {
  if (!client || typeof client !== 'object') {
    return false;
  }

  const value = (client as Record<string, unknown>)[delegateName];
  return !!value && typeof value === 'object';
}

function assertDelegate(client: unknown, delegateName: string): void {
  if (!hasDelegate(client, delegateName)) {
    throw new Error(
      `PrismaClient sem delegate "${delegateName}". Rode generate/migrations para sincronizar o client com o schema atualizado.`,
    );
  }
}

function isPermissionDTO(value: unknown): value is PermissionDTO {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    typeof (value as { id: unknown }).id === 'string' &&
    'alias' in value &&
    typeof (value as { alias: unknown }).alias === 'string'
  );
}

function resolvePermissionRef(
  permissionRef: string,
  allPermissions: PermissionDTO[],
): PermissionDTO[] {
  const ref = permissionRef.trim();

  if (ref === '*') {
    return allPermissions;
  }

  const pathParts = ref.split('.').filter(Boolean);
  let current: unknown = PERMISSIONS;

  for (const pathPart of pathParts) {
    current = (current as Record<string, unknown> | undefined)?.[pathPart];
  }

  if (isPermissionDTO(current)) {
    return [current];
  }

  throw new Error(`Referência de permissão inválida: "${permissionRef}"`);
}

async function seedPermissionsFromCode(
  prisma: PrismaClient,
  logger: SeedLogger,
): Promise<PermissionDTO[]> {
  const permissionList = flattenPermissions(PERMISSIONS);
  const syncedPermissions: PermissionDTO[] = [];

  logger.info('Persistindo permissões a partir do código', {
    total: permissionList.length,
  });

  for (const [index, permission] of permissionList.entries()) {
    const synced = await prisma.permission.upsert({
      where: { id: permission.id },
      create: {
        id: permission.id!,
        name: permission.name,
        alias: permission.alias,
        description: permission.description,
        criticality: permission.criticality,
      },
      update: {
        name: permission.name,
        alias: permission.alias,
        description: permission.description,
        criticality: permission.criticality,
      },
    });

    syncedPermissions.push(synced as PermissionDTO);

    const processed = index + 1;
    if (
      processed % PERMISSION_PROGRESS_EVERY === 0 ||
      processed === permissionList.length
    ) {
      logger.progress(
        'Permissões processadas',
        processed,
        permissionList.length,
      );
    }
  }

  return syncedPermissions;
}

function resolveRolePermissionIds(
  role: RoleSeedItem,
  allPermissions: PermissionDTO[],
  permissionById: Map<string, PermissionDTO>,
): string[] {
  const selected = new Map<string, PermissionDTO>();

  for (const permissionRef of role.permissionRefs) {
    const resolved = resolvePermissionRef(permissionRef, allPermissions);
    for (const permission of resolved) {
      const synced = permissionById.get(permission.id!);
      if (!synced) {
        continue;
      }
      selected.set(synced.id!, synced);
    }
  }

  return [...selected.values()].map((permission) => permission.id!);
}

function flattenPermissions(source: Record<string, unknown>): PermissionDTO[] {
  const result: PermissionDTO[] = [];

  function walk(node: unknown): void {
    if (!node || typeof node !== 'object') {
      return;
    }

    const candidate = node as Partial<PermissionDTO>;
    if (
      candidate.id &&
      candidate.name &&
      candidate.alias &&
      candidate.description
    ) {
      result.push(candidate as PermissionDTO);
      return;
    }

    for (const value of Object.values(node)) {
      walk(value);
    }
  }

  walk(source);
  return result;
}

function randomInt(min: number, max: number): number {
  const safeMin = Math.ceil(min);
  const safeMax = Math.floor(max);
  return Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;
}

function pickWeighted<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce(
    (sum, item) => sum + Math.max(0, item.weight),
    0,
  );

  if (totalWeight <= 0) {
    return items[randomInt(0, items.length - 1)];
  }

  let target = Math.random() * totalWeight;
  for (const item of items) {
    target -= Math.max(0, item.weight);
    if (target <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

async function seedAuditEvents(
  db: Record<string, any>,
  logger: SeedLogger,
): Promise<number> {
  const seed = await readJsonFile<AuditEventsSeedFile>(AUDIT_EVENTS_FILE);
  const users = await db.user.findMany({
    select: { id: true, email: true },
    orderBy: { email: 'asc' },
  });

  if (!users.length) {
    logger.warn('Seed de auditoria ignorado: nenhum usuário encontrado.');
    return 0;
  }

  const baselineTotal = seed.daysBack * seed.eventsPerDay;
  const scenarios = seed.items.filter((item) => item.weight > 0);

  if (!scenarios.length) {
    logger.warn('Seed de auditoria ignorado: nenhum cenário com weight > 0.');
    return 0;
  }

  const useCurrentDate = seed.useCurrentDate !== false;
  const parsedBaseDate = seed.baseDate ? new Date(seed.baseDate) : null;
  const hasValidBaseDate =
    parsedBaseDate instanceof Date && !Number.isNaN(parsedBaseDate.getTime());
  const referenceDate =
    useCurrentDate || !hasValidBaseDate ? new Date() : parsedBaseDate;

  logger.info('Recriando massa de auditoria do módulo auth', {
    totalEstimate: baselineTotal,
    daysBack: seed.daysBack,
    eventsPerDay: seed.eventsPerDay,
    referenceDate: referenceDate.toISOString(),
    mode: useCurrentDate ? 'rolling_now' : 'fixed_base_date',
  });

  await db.auditEvent.deleteMany({});

  const rows: Array<Record<string, unknown>> = [];
  for (let day = 0; day < seed.daysBack; day += 1) {
    const volumeVariance = randomInt(-20, 20) / 100;
    const dailyEvents = Math.max(
      1,
      Math.round(seed.eventsPerDay * (1 + volumeVariance)),
    );

    for (let slot = 0; slot < dailyEvents; slot += 1) {
      const scenario = pickWeighted(scenarios);
      const isPriorityActor = Math.random() < 0.55;
      const actorPool = isPriorityActor
        ? users.slice(0, Math.max(1, Math.floor(users.length * 0.25)))
        : users;
      const actor = actorPool[randomInt(0, actorPool.length - 1)]!;
      const statusCode =
        scenario.statusCodes[randomInt(0, scenario.statusCodes.length - 1)];
      const durationMs = randomInt(scenario.durationMin, scenario.durationMax);
      const hour = pickWeighted(HOUR_WEIGHTS).hour;
      const occurredAt = new Date(referenceDate);
      occurredAt.setDate(referenceDate.getDate() - day);
      occurredAt.setHours(hour, randomInt(0, 59), randomInt(0, 59));
      occurredAt.setMilliseconds(0);

      rows.push({
        type: scenario.type,
        occurredAt,
        method: scenario.method,
        endpoint: scenario.endpoint,
        userId: scenario.anonymous ? null : actor.id,
        userEmail: scenario.anonymous
          ? seed.anonymousLoginEmails[
              randomInt(0, seed.anonymousLoginEmails.length - 1)
            ]
          : actor.email,
        permissionId: null,
        permissionAlias: scenario.permissionAlias ?? null,
        action: scenario.action,
        criticality: scenario.criticality,
        statusCode,
        durationMs,
      });
    }
  }

  let inserted = 0;
  for (let i = 0; i < rows.length; i += AUDIT_BATCH_SIZE) {
    const batch = rows.slice(i, i + AUDIT_BATCH_SIZE);
    const result = await db.auditEvent.createMany({ data: batch });
    inserted += result.count ?? 0;
  }

  logger.info('Massa de auditoria criada', { total: inserted });
  return inserted;
}

export async function seedAuthModule(prisma: PrismaClient) {
  const logger = new SeedLogger('auth');
  const db = prisma as unknown as Record<string, any>;

  assertDelegate(db, 'permission');
  assertDelegate(db, 'role');
  assertDelegate(db, 'user');
  assertDelegate(db, 'password');
  assertDelegate(db, 'rolePermission');
  assertDelegate(db, 'userRole');
  assertDelegate(db, 'auditEvent');

  const [rolesSeed, usersSeed] = await Promise.all([
    readJsonFile<RolesSeedFile>(ROLES_FILE),
    readJsonFile<UsersSeedFile>(USERS_FILE),
  ]);

  logger.info('Iniciando seed do módulo de autenticação', {
    roles: rolesSeed.total,
    users: usersSeed.total,
  });

  const stats: AuthSeedStats = {
    permissions: 0,
    rolesCreated: 0,
    rolesUpdated: 0,
    usersCreated: 0,
    usersUpdated: 0,
    usersSkipped: 0,
    passwordsCreated: 0,
    auditEventsCreated: 0,
  };

  const syncedPermissions = await seedPermissionsFromCode(prisma, logger);
  stats.permissions = syncedPermissions.length;

  const permissionById = new Map<string, PermissionDTO>(
    syncedPermissions.map((permission) => [permission.id!, permission]),
  );

  logger.info('Persistindo roles do JSON');
  for (const [index, roleSeed] of rolesSeed.items.entries()) {
    const permissionIds = resolveRolePermissionIds(
      roleSeed,
      syncedPermissions,
      permissionById,
    );

    const existingRole = await db.role.findUnique({
      where: { name: roleSeed.name },
      select: { id: true },
    });

    const persistedRole = await db.role.upsert({
      where: { name: roleSeed.name },
      create: {
        name: roleSeed.name,
        description: roleSeed.description,
      },
      update: {
        description: roleSeed.description,
      },
      select: { id: true },
    });

    await db.rolePermission.deleteMany({
      where: { roleId: persistedRole.id },
    });

    if (permissionIds.length > 0) {
      await db.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId: persistedRole.id,
          permissionId,
        })),
      });
    }

    if (existingRole) {
      stats.rolesUpdated += 1;
    } else {
      stats.rolesCreated += 1;
    }

    const processed = index + 1;
    if (
      processed % ROLE_PROGRESS_EVERY === 0 ||
      processed === rolesSeed.items.length
    ) {
      logger.progress('Roles processadas', processed, rolesSeed.items.length, {
        created: stats.rolesCreated,
        updated: stats.rolesUpdated,
      });
    }
  }

  const persistedRoles = await db.role.findMany({
    select: { id: true, name: true },
  });
  const roleIdByName = new Map<string, string>(
    persistedRoles.map((role: { id: string; name: string }) => [
      role.name,
      role.id,
    ]),
  );

  logger.info('Persistindo usuários do JSON');
  for (const [index, userSeed] of usersSeed.items.entries()) {
    const roleIds = userSeed.roles
      .map((roleName) => roleIdByName.get(roleName))
      .filter((roleId): roleId is string => !!roleId);

    if (roleIds.length !== userSeed.roles.length) {
      stats.usersSkipped += 1;

      logger.warn('Usuário ignorado por role inexistente', {
        email: userSeed.email,
      });

      const processed = index + 1;
      if (
        processed % USER_PROGRESS_EVERY === 0 ||
        processed === usersSeed.items.length
      ) {
        logger.progress(
          'Usuários processados',
          processed,
          usersSeed.items.length,
          {
            created: stats.usersCreated,
            updated: stats.usersUpdated,
            skipped: stats.usersSkipped,
          },
        );
      }
      continue;
    }

    const existingUser = await db.user.findUnique({
      where: { email: userSeed.email },
      include: { passwords: { select: { id: true } } },
    });

    if (!existingUser) {
      const passwordHash = await bcrypt.hash(userSeed.password, 10);

      const createdUser = await db.user.create({
        data: {
          name: userSeed.name,
          email: userSeed.email,
          avatarUrl: userSeed.avatarUrl,
          passwords: {
            create: {
              content: passwordHash,
              status: 'ACTIVE',
            },
          },
        },
        select: { id: true },
      });

      if (roleIds.length > 0) {
        await db.userRole.createMany({
          data: roleIds.map((roleId) => ({
            userId: createdUser.id,
            roleId,
          })),
        });
      }

      stats.usersCreated += 1;
      stats.passwordsCreated += 1;
    } else {
      await db.user.update({
        where: { email: userSeed.email },
        data: {
          name: userSeed.name,
          avatarUrl: userSeed.avatarUrl,
        },
      });

      await db.userRole.deleteMany({
        where: { userId: existingUser.id },
      });

      if (roleIds.length > 0) {
        await db.userRole.createMany({
          data: roleIds.map((roleId) => ({
            userId: existingUser.id,
            roleId,
          })),
        });
      }

      stats.usersUpdated += 1;

      if (!existingUser.passwords.length) {
        const passwordHash = await bcrypt.hash(userSeed.password, 10);
        await db.password.create({
          data: {
            userId: existingUser.id,
            content: passwordHash,
            status: 'ACTIVE',
          },
        });
        stats.passwordsCreated += 1;
      }
    }

    const processed = index + 1;
    if (
      processed % USER_PROGRESS_EVERY === 0 ||
      processed === usersSeed.items.length
    ) {
      logger.progress(
        'Usuários processados',
        processed,
        usersSeed.items.length,
        {
          created: stats.usersCreated,
          updated: stats.usersUpdated,
          skipped: stats.usersSkipped,
        },
      );
    }
  }

  stats.auditEventsCreated = await seedAuditEvents(db, logger);

  logger.info('Seed do módulo de autenticação concluído', {
    permissions: stats.permissions,
    rolesCreated: stats.rolesCreated,
    rolesUpdated: stats.rolesUpdated,
    usersCreated: stats.usersCreated,
    usersUpdated: stats.usersUpdated,
    usersSkipped: stats.usersSkipped,
    passwordsCreated: stats.passwordsCreated,
    auditEventsCreated: stats.auditEventsCreated,
  });
}
