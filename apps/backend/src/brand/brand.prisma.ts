import { Injectable } from '@nestjs/common';
import { Result } from '@pharmacore/shared';
import {
  Brand,
  BrandRepository,
  BrandErrors,
  BrandDetailsDTO,
  BrandListDTO,
  FindBrandDetailsByIdQuery,
  FindManyBrandsQuery,
  BrandQueryDTO,
} from '@pharmacore/product';

import { PrismaService } from '../db/prisma.service';
import { BrandGetPayload } from 'prisma/generated/prisma/models';

type PrismaBrandPayload = BrandGetPayload<{}>;

@Injectable()
export class BrandPrisma implements BrandRepository {
  private readonly PAGE_SIZE = 10;
  constructor(private readonly prisma: PrismaService) {}

  private toBrandDetailsDTO(b: PrismaBrandPayload): BrandDetailsDTO {
    return {
      id: b.id,
      name: b.name,
      alias: b.alias,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      deletedAt: b.deletedAt,
    };
  }

  private toBrandEntity(b: PrismaBrandPayload): Brand {
    return Brand.create({
      id: b.id,
      name: b.name,
      alias: b.alias,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      deletedAt: b.deletedAt,
    });
  }

  async create(entity: Brand): Promise<Result<void>> {
    try {
      await this.prisma.client.brand.create({
        data: {
          id: entity.id,
          name: entity.name,
          alias: entity.alias,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          deletedAt: entity.deletedAt,
        },
      });
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  findMany: FindManyBrandsQuery = {
    execute: async (filters: BrandQueryDTO): Promise<Result<BrandListDTO>> => {
      try {
        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? this.PAGE_SIZE;
        const skip = (page - 1) * pageSize;

        const where = {
          deletedAt: null,
          ...(filters.search && {
            name: {
              search: filters.search,
              mode: 'insensitive' as const,
            },
          }),
        };

        const [brands, totalCount] = await Promise.all([
          this.prisma.client.brand.findMany({
            where,
            orderBy: { name: 'asc' },
            take: pageSize,
            skip,
          }),
          this.prisma.client.brand.count({ where }),
        ]);

        const totalPages = Math.ceil(totalCount / pageSize);

        return Result.ok({
          data: brands.map((brand) => ({
            id: brand.id,
            name: brand.name,
            alias: brand.alias,
          })),
          meta: { page, pageSize, total: totalCount, totalPages },
        });
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  async update(entity: Brand): Promise<Result<void>> {
    try {
      const currentData = await this.prisma.client.brand.findUnique({
        where: { id: entity.id },
      });

      if (!currentData) {
        return Result.fail(BrandErrors.NOT_FOUND);
      }

      await this.prisma.client.brand.update({
        where: { id: entity.id },
        data: {
          name: entity.name,
          alias: entity.alias,
          updatedAt: new Date(),
        },
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  async findById(id: string): Promise<Result<Brand>> {
    try {
      const brand = await this.prisma.client.brand.findFirst({
        where: { id, deletedAt: null },
      });

      if (!brand) {
        return Result.fail(BrandErrors.NOT_FOUND);
      }

      return Result.ok(this.toBrandEntity(brand));
    } catch (error) {
      return Result.fail(error);
    }
  }

  findDetailsById: FindBrandDetailsByIdQuery = {
    execute: async (id: string): Promise<Result<BrandDetailsDTO>> => {
      const result = await this.findById(id);
      if (result.isFailure) {
        return result;
      }
      return Result.ok(this.toBrandDetailsDTO(result.instance));
    },
  };

  async delete(id: string): Promise<Result<void>> {
    try {
      const existing = await this.findById(id);
      if (existing.isFailure) {
        return Result.fail(BrandErrors.NOT_FOUND);
      }

      await this.prisma.client.brand.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }
}
