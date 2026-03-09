import { Injectable } from '@nestjs/common';
import { Result } from '@pharmacore/shared';
import {
  Category,
  CategoryRepository,
  CategoryErrors,
  SubcategoryErrors,
  CategoryDetailsDTO,
  CategoryListDTO,
  SubcategoryListDTO,
  SubcategoryExistenceChecker,
  FindManyCategoriesQuery,
  FindSubcategoriesByCategoryIdQuery,
  FindCategoryDetailsByIdQuery,
  SubcategoriesList,
} from '@pharmacore/product';

import { PrismaService } from '../db/prisma.service';
import { CategoryGetPayload } from 'prisma/generated/prisma/models';

type PrismaCategoryPayload =
  | CategoryGetPayload<{
      include: { subcategories: true };
    }>
  | CategoryGetPayload<{}>;

@Injectable()
export class CategoryPrisma
  implements CategoryRepository, SubcategoryExistenceChecker
{
  constructor(private readonly prisma: PrismaService) {}

  private toCategoryDetailsDTO(c: PrismaCategoryPayload): CategoryDetailsDTO {
    const subcategories = (c as any).subcategories
      ? (c as any).subcategories.map((s: any) => ({
          id: s.id,
          name: s.name,
          alias: s.alias,
        }))
      : undefined;

    return {
      id: c.id,
      name: c.name,
      alias: c.alias,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      deletedAt: c.deletedAt,
      subcategories,
    };
  }

  private toCategoryEntity(c: PrismaCategoryPayload): Category {
    const subcategoriesProps = (c as any).subcategories
      ? (c as any).subcategories?.map((s: any) => ({
          id: s.id,
          name: s.name,
          alias: s.alias,
          order: s.order,
        }))
      : undefined;
    const sunbcategoryList = SubcategoriesList.create(subcategoriesProps);
    return Category.create({
      id: c.id,
      name: c.name,
      alias: c.alias,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      deletedAt: c.deletedAt,
      subcategories: sunbcategoryList,
    });
  }

  async create(entity: Category): Promise<Result<void>> {
    try {
      await this.prisma.client.category.create({
        data: {
          id: entity.id,
          name: entity.name,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          deletedAt: entity.deletedAt,
          alias: entity.alias,
          subcategories:
            entity.subcategories && entity.subcategories.length > 0
              ? {
                  create: entity.subcategories.map((sub) => ({
                    id: sub.id,
                    name: sub.name,
                    createdAt: sub.createdAt,
                    updatedAt: sub.updatedAt,
                    deletedAt: sub.deletedAt,
                    alias: sub.alias,
                    order: sub.order,
                  })),
                }
              : undefined,
        },
      });
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  async update(entity: Category): Promise<Result<void>> {
    try {
      const currentData = await this.prisma.client.category.findUnique({
        where: { id: entity.id },
        include: { subcategories: true },
      });

      if (!currentData) {
        return Result.fail(CategoryErrors.NOT_FOUND);
      }

      const currentSubcats = new Map(
        currentData.subcategories.map((s) => [s.id, s]),
      );
      const newSubcats = new Map(entity.subcategories.map((s) => [s.id, s]));

      const toDelete = currentData.subcategories
        .filter((s) => !newSubcats.has(s.id))
        .map((s) => s.id);

      const toCreate = entity.subcategories.filter(
        (s) => !currentSubcats.has(s.id),
      );

      const toUpdate = entity.subcategories
        .filter((s) => currentSubcats.has(s.id))
        .filter((s) => {
          const current = currentSubcats.get(s.id)!;
          return (
            current.name !== s.name ||
            current.order !== s.order ||
            current.alias !== s.alias
          );
        });

      await this.prisma.client.$transaction(async (tx) => {
        if (toDelete.length > 0) {
          await tx.subcategory.deleteMany({
            where: { id: { in: toDelete } },
          });
        }

        if (toCreate.length > 0) {
          await tx.subcategory.createMany({
            data: toCreate.map((sub) => ({
              id: sub.id,
              name: sub.name,
              alias: sub.alias,
              parentId: entity.id,
              order: sub.order,
              createdAt: sub.createdAt,
              updatedAt: new Date(),
              deletedAt: sub.deletedAt,
            })),
          });
        }

        for (const sub of toUpdate) {
          await tx.subcategory.update({
            where: { id: sub.id },
            data: {
              name: sub.name,
              order: sub.order,
              alias: sub.alias,
              updatedAt: new Date(),
            },
          });
        }

        await tx.category.update({
          where: { id: entity.id },
          data: {
            name: entity.name,
            alias: entity.alias,
            updatedAt: new Date(),
          },
        });
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  findDetailsById: FindCategoryDetailsByIdQuery = {
    execute: async (
      id: string,
      { getSubcategories }: { getSubcategories?: boolean } = {},
    ): Promise<Result<CategoryDetailsDTO>> => {
      try {
        const category = await this.prisma.client.category.findFirst({
          where: { id, deletedAt: null },
          include: getSubcategories ? { subcategories: true } : undefined,
        });
        if (!category) {
          return Result.fail(CategoryErrors.NOT_FOUND);
        }
        return Result.ok(this.toCategoryDetailsDTO(category));
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  async findAll(): Promise<Result<Category[]>> {
    return Result.ok([]);
  }

  findMany: FindManyCategoriesQuery = {
    execute: async ({
      getSubcategories,
    }: { getSubcategories?: boolean } = {}): Promise<
      Result<CategoryListDTO>
    > => {
      try {
        const categories = await this.prisma.client.category.findMany({
          where: { deletedAt: null },
          include: getSubcategories ? { subcategories: true } : undefined,
        });
        const dtos = categories.map((c) => this.toCategoryDetailsDTO(c));
        return Result.ok(dtos);
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  async findById(id: string): Promise<Result<Category>> {
    try {
      const category = await this.prisma.client.category.findFirst({
        where: { id, deletedAt: null },
        include: { subcategories: true },
      });
      if (!category) {
        return Result.fail(CategoryErrors.NOT_FOUND);
      }
      return Result.ok(this.toCategoryEntity(category));
    } catch (error) {
      return Result.fail(error);
    }
  }

  async delete(id: string): Promise<Result<void>> {
    const existing = await this.findById(id);
    if (existing.isFailure) {
      return Result.fail(CategoryErrors.NOT_FOUND);
    }

    try {
      await this.prisma.client.category.update({
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

  async subcategoryExists(id: string): Promise<Result<boolean>> {
    try {
      const subcategory = await this.prisma.client.subcategory.findUnique({
        where: { id },
      });
      if (!subcategory) {
        return Result.fail(SubcategoryErrors.NOT_FOUND);
      }
      return Result.ok(true);
    } catch (error) {
      return Result.fail(error);
    }
  }

  findSubcategoriesByCategoryId: FindSubcategoriesByCategoryIdQuery = {
    execute: async (id: string): Promise<Result<SubcategoryListDTO>> => {
      try {
        const category = await this.prisma.client.category.findFirst({
          where: { id, deletedAt: null },
          include: { subcategories: true },
        });
        if (!category) {
          return Result.fail(CategoryErrors.NOT_FOUND);
        }
        const subcategories = category.subcategories.map((s: any) => ({
          id: s.id,
          name: s.name,
          alias: s.alias,
          order: s.order,
          parentId: s.parentId,
        }));
        return Result.ok(subcategories);
      } catch (error) {
        return Result.fail(error);
      }
    },
  };
}
