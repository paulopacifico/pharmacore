import { readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { PrismaClient } from '../generated/prisma/client';
import { SeedLogger } from './seed-logger';

type AddressSeedItem = {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type BranchSeedItem = {
  id: string;
  name: string;
  cnpj: string;
  isActive: boolean;
  address: AddressSeedItem;
  establishedAt?: string | null;
};

type BranchesSeedFile = {
  total: number;
  items: BranchSeedItem[];
};

type BranchSeedStats = {
  branchesCreated: number;
  branchesUpdated: number;
};

const DATA_DIR = path.resolve(__dirname, 'data/branch');
const BRANCHES_FILE = path.join(DATA_DIR, 'branches.json');
const BRANCH_PROGRESS_EVERY = 5;

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

export async function seedBranchModule(prisma: PrismaClient) {
  const logger = new SeedLogger('branch');
  const db = prisma as unknown as Record<string, any>;

  assertDelegate(db, 'branch');

  const branchesSeed = await readJsonFile<BranchesSeedFile>(BRANCHES_FILE);

  logger.info('Iniciando seed do módulo de filiais', {
    total: branchesSeed.total,
  });

  const stats: BranchSeedStats = {
    branchesCreated: 0,
    branchesUpdated: 0,
  };

  logger.info('Persistindo filiais do JSON');

  for (const [index, branchSeed] of branchesSeed.items.entries()) {
    const { id, name, cnpj, isActive, address, establishedAt } = branchSeed;

    const data: Record<string, unknown> = {
      name,
      cnpj,
      isActive,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    };
    if (establishedAt != null) {
      data.establishedAt = new Date(establishedAt);
    }

    const existingBranch = await db.branch.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingBranch) {
      await db.branch.create({
        data: {
          id,
          ...data,
        },
      });
      stats.branchesCreated += 1;
    } else {
      await db.branch.update({
        where: { id },
        data,
      });
      stats.branchesUpdated += 1;
    }

    const processed = index + 1;
    if (
      processed % BRANCH_PROGRESS_EVERY === 0 ||
      processed === branchesSeed.items.length
    ) {
      logger.progress(
        'Filiais processadas',
        processed,
        branchesSeed.items.length,
        {
          created: stats.branchesCreated,
          updated: stats.branchesUpdated,
        },
      );
    }
  }

  logger.info('Seed do módulo de filiais concluído', {
    branchesCreated: stats.branchesCreated,
    branchesUpdated: stats.branchesUpdated,
  });
}
