import { Result } from '@pharmacore/shared';
import {
  Branch,
  BranchErrors,
  BranchRepository,
  FindBranchDetailsByIdQuery,
  FindManyBranchesQuery,
  FindBranchOverviewQuery,
  BranchDetailsDTO,
  BranchOverviewDTO,
} from '@pharmacore/branch';
import { Injectable } from '@nestjs/common';
import { BranchGetPayload } from 'prisma/generated/prisma/models';
import { PrismaService } from 'src/db/prisma.service';
import { FindManyBranchesIn, FindManyBranchesOut } from '@pharmacore/branch';

type BranchPayload = BranchGetPayload<{}>;

@Injectable()
export class BranchPrisma implements BranchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: Branch): Promise<Result<void>> {
    try {
      await this.prisma.client.branch.create({
        data: this.fromDomain(entity),
      });
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  async update(entity: Branch): Promise<Result<void>> {
    try {
      await this.prisma.client.branch.update({
        where: { id: entity.id },
        data: this.fromDomain(entity),
      });
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  async findById(id: string): Promise<Result<Branch>> {
    try {
      const b = await this.prisma.client.branch.findUnique({
        where: { id },
      });
      if (!b) return Result.fail(BranchErrors.NOT_FOUND);
      return Result.ok(this.toDomain(b));
    } catch (error) {
      return Result.fail(error);
    }
  }

  async findAll(): Promise<Result<Branch[]>> {
    return Result.ok([]);
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.prisma.client.branch.delete({
        where: { id },
      });
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  findDetailsById: FindBranchDetailsByIdQuery = {
    execute: async (branchId: string): Promise<Result<BranchDetailsDTO>> => {
      try {
        const b = await this.prisma.client.branch.findUnique({
          where: { id: branchId },
        });
        if (!b) return Result.fail(BranchErrors.NOT_FOUND);
        return Result.ok(this.toBranchDetailsDTO(b));
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  findMany: FindManyBranchesQuery = {
    execute: async ({
      page,
      pageSize,
      name,
    }: FindManyBranchesIn): Promise<Result<FindManyBranchesOut>> => {
      try {
        const safePageSize = Math.min(
          Math.max(Math.floor(pageSize || 10), 1),
          100,
        );
        const safeRequestedPage = Math.max(Math.floor(page || 1), 1);

        const where = name?.trim()
          ? { name: { contains: name.trim(), mode: 'insensitive' as const } }
          : {};

        const total = await this.prisma.client.branch.count({ where });
        const totalPages = total === 0 ? 0 : Math.ceil(total / safePageSize);
        const safePage =
          totalPages === 0 ? 1 : Math.min(safeRequestedPage, totalPages);
        const skip = (safePage - 1) * safePageSize;

        const results = await this.prisma.client.branch.findMany({
          where,
          skip,
          take: safePageSize,
          orderBy: { createdAt: 'desc' },
        });

        const data = results.map((b) => this.toBranchDetailsDTO(b));

        return Result.ok({
          data,
          meta: {
            page: safePage,
            pageSize: safePageSize,
            total,
            totalPages,
          },
        });
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  findOverview: FindBranchOverviewQuery = {
    execute: async (): Promise<Result<BranchOverviewDTO>> => {
      try {
        const [total, active, inactive, statesResult, byStateResult, recentBranches, byYearResult] =
          await Promise.all([
            this.prisma.client.branch.count(),
            this.prisma.client.branch.count({ where: { isActive: true } }),
            this.prisma.client.branch.count({ where: { isActive: false } }),
            this.prisma.client.branch.groupBy({
              by: ['state'],
              _count: { state: true },
            }),
            this.prisma.client.branch.groupBy({
              by: ['state'],
              _count: { state: true },
              orderBy: { _count: { state: 'desc' } },
            }),
            this.prisma.client.branch.findMany({
              orderBy: { createdAt: 'desc' },
              take: 5,
            }),
            this.prisma.client.branch.groupBy({
              by: ['establishedAt'],
              _count: { id: true },
              where: { establishedAt: { not: null } },
            }),
          ]);

        const yearMap = new Map<number, number>();
        for (const row of byYearResult) {
          if (row.establishedAt) {
            const year = new Date(row.establishedAt).getFullYear();
            yearMap.set(year, (yearMap.get(year) || 0) + row._count.id);
          }
        }
        const byYear = Array.from(yearMap.entries())
          .map(([year, count]) => ({ year, count }))
          .sort((a, b) => a.year - b.year);

        return Result.ok({
          kpi: {
            total,
            active,
            inactive,
            statesCount: statesResult.length,
          },
          byState: byStateResult.map((r) => ({
            state: r.state,
            count: r._count.state,
          })),
          recentBranches: recentBranches.map((b) => ({
            id: b.id,
            name: b.name,
            city: b.city,
            state: b.state,
            isActive: b.isActive,
            createdAt: b.createdAt,
          })),
          byYear,
        });
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  private toDomain(b: BranchPayload): Branch {
    return Branch.create({
      id: b.id,
      name: b.name,
      cnpj: b.cnpj,
      isActive: b.isActive,
      address: {
        street: b.street,
        number: b.number,
        complement: b.complement,
        neighborhood: b.neighborhood,
        city: b.city,
        state: b.state,
        zip: b.zip,
        country: b.country,
      },
      establishedAt: b.establishedAt ?? null,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      deletedAt: b.deletedAt,
    });
  }

  private toBranchDetailsDTO(b: BranchPayload): BranchDetailsDTO {
    return {
      id: b.id,
      name: b.name,
      cnpj: b.cnpj,
      isActive: b.isActive,
      address: {
        street: b.street,
        number: b.number,
        complement: b.complement,
        neighborhood: b.neighborhood,
        city: b.city,
        state: b.state,
        zip: b.zip,
        country: b.country,
      },
      establishedAt: b.establishedAt ?? null,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      deletedAt: b.deletedAt,
    };
  }

  private fromDomain(b: Branch) {
    const address = b.address;
    return {
      id: b.id,
      name: b.name,
      cnpj: b.cnpj,
      isActive: b.isActive,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      establishedAt: b.establishedAt ?? undefined,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      deletedAt: b.deletedAt,
    };
  }
}
