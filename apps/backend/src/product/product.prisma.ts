import { Injectable } from '@nestjs/common';
import { Result } from '@pharmacore/shared';
import {
  Product,
  ProductRepository,
  ProductErrors,
  FindManyProductsWithFiltersQuery,
  ProductListDTO,
  ProductDetailsDTO,
  FindKpiQuery,
  FindCategorySubcategoryRelationsQuery,
  FindLastCreatedProductsQuery,
  FindLastDeletedProductsQuery,
  RecentProductsDTO,
  FindProductDetailsByAliasQuery,
  KpiDTO,
} from '@pharmacore/product';
import { PrismaService } from '../db/prisma.service';
import { ProductGetPayload } from 'prisma/generated/prisma/models';
import { Prisma } from 'prisma/generated/prisma/client';

type PrismaProductPayload = ProductGetPayload<{
  include: { images: true; characteristics: true };
}>;

type PrismaProductWithRelations = ProductGetPayload<{
  include: {
    images: true;
    characteristics: true;
    subcategory: {
      include: { category: true };
    };
    brand: true;
  };
}>;

@Injectable()
export class ProductPrisma implements ProductRepository {
  private PAGE_SIZE = 15;
  constructor(private readonly prisma: PrismaService) {}

  private async toDomainProduct(p: PrismaProductPayload): Promise<Product> {
    const imagesURL =
      (p as any).images && (p as any).images.length > 0
        ? (p as any).images.map((img) => img.url)
        : [];

    const characteristics = ((p as any).characteristics ?? []).map(
      (characteristic: any) => ({
        name: characteristic.name,
        value: characteristic.value,
      }),
    );

    const result = Product.tryCreate({
      id: p.id,
      name: p.name,
      alias: p.alias,
      description: p.description,
      imagesURL: imagesURL,
      price: (p as any).price || 0,
      subcategoryId: p.subcategoryId,
      brandId: p.brandId,
      sku: p.sku,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      deletedAt: p.deletedAt,
      characteristics,
    });
    return result.instance;
  }

  private toProductListDTO(
    data: PrismaProductPayload[],
    totalItems: number,
    page: number,
    pageSize: number,
  ): ProductListDTO {
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: data.map((p) => {
        const images = (p as any).images;
        const imagesURL = images.map((img) => img.url);

        return {
          id: p.id,
          name: p.name,
          alias: p.alias,
          description: p.description,
          imagesURL: imagesURL,
          price: (p as any).price || 0,
          sku: p.sku,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          deletedAt: p.deletedAt,
        };
      }),
      meta: { page, pageSize, total: totalItems, totalPages },
    };
  }

  private toProductDetailsDTO(p: PrismaProductWithRelations): any {
    const imagesURL =
      (p as any).images && (p as any).images.length > 0
        ? (p as any).images.map((img) => img.url)
        : [];

    const subcategory = (p as any).subcategory;
    const category = subcategory!.category;
    const brand = (p as any).brand;
    const characteristics = ((p as any).characteristics ?? []).map(
      (characteristic: any) => ({
        name: characteristic.name,
        value: characteristic.value,
      }),
    );

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      imagesURL: imagesURL,
      price: (p as any).price || 0,
      sku: p.sku,
      alias: p.alias,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      deletedAt: p.deletedAt,
      characteristics: characteristics,
      category: { id: category.id, name: category.name },
      subcategory: { id: subcategory.id, name: subcategory.name },
      brand: { id: brand.id, name: brand.name },
    };
  }

  async create(entity: Product): Promise<Result<void>> {
    try {
      const characteristicData = (entity.characteristics ?? []).map((char) => ({
        name: char.name,
        value: char.value,
      }));

      await this.prisma.client.product.create({
        data: {
          id: entity.id,
          name: entity.name,
          alias: entity.alias,
          description: entity.description,
          price: entity.price,
          sku: entity.sku,
          characteristics:
            characteristicData.length > 0
              ? { create: characteristicData }
              : undefined,
          images: {
            create: entity.imagesURL.map((url) => ({
              id: undefined,
              url: url,
            })),
          },
          subcategory: {
            connect: { id: entity.subcategoryId },
          },
          brand: {
            connect: { id: entity.brandId },
          },
        },
      });
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  async update(entity: Product): Promise<Result<void>> {
    try {
      const characteristicData = (entity.characteristics ?? []).map((char) => ({
        name: char.name,
        value: char.value,
      }));

      await this.prisma.client.product.update({
        where: { id: entity.id },
        data: {
          name: entity.name,
          description: entity.description,
          price: entity.price,
          sku: entity.sku,
          alias: entity.alias,
          characteristics: {
            deleteMany: {},
            create: characteristicData,
          },
          subcategory: {
            connect: { id: entity.subcategoryId },
          },
          brand: {
            connect: { id: entity.brandId },
          },
          updatedAt: new Date(),

          images: {
            deleteMany: {},
            create: entity.imagesURL.map((url) => ({
              id: undefined,
              url: url,
            })),
          },
        },
      });
      return Result.ok();
    } catch (error) {
      return Result.fail(error);
    }
  }

  async findById(id: string): Promise<Result<Product>> {
    try {
      const product = await this.prisma.client.product.findFirst({
        where: { id, deletedAt: null },
        include: {
          images: true,
          brand: true,
          characteristics: true,
        },
      });

      if (!product) {
        return Result.fail(ProductErrors.NOT_FOUND);
      }

      return Result.ok(await this.toDomainProduct(product));
    } catch (error) {
      return Result.fail(error);
    }
  }

  findMany: FindManyProductsWithFiltersQuery = {
    execute: async (filters): Promise<Result<any>> => {
      try {
        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? this.PAGE_SIZE;
        const take = pageSize;
        const skip = (page - 1) * pageSize;

        const baseSelect = Prisma.sql`
      SELECT DISTINCT 
        p."id", p."alias", p."name", p."description", p."price", p."sku",
        p."subcategory_id", p."brand_id", p."created_at", p."updated_at", p."deletedAt",
        COUNT(*) OVER() as total_count,
        STRING_AGG(DISTINCT i."url", ',') as image_urls
    `;

        const searchQuery = filters.search
          ? filters.search
              .split(/\s+/)
              .map((term) => `${term}:*`)
              .join(' & ')
          : null;

        const relevanceSelect = filters.search
          ? Prisma.sql`,
          (
            ts_rank(p."name_tsvector", to_tsquery('portuguese', ${searchQuery})) * 2 +
            ts_rank(p."description_tsvector", to_tsquery('portuguese', ${searchQuery}))
          ) as relevance_score
        `
          : Prisma.empty;

        const fromClause = filters.categoryId
          ? Prisma.sql`FROM "products" p 
          LEFT JOIN "subcategories" s ON p."subcategory_id" = s."id"
          LEFT JOIN "product_images" i ON p."id" = i."productId"`
          : Prisma.sql`FROM "products" p 
          LEFT JOIN "product_images" i ON p."id" = i."productId"`;

        const baseWhere = Prisma.sql`WHERE p."deletedAt" IS NULL`;

        const searchWhere = filters.search
          ? Prisma.sql`AND (
          p."name_tsvector" @@ to_tsquery('portuguese', ${searchQuery})
          OR 
          p."description_tsvector" @@ to_tsquery('portuguese', ${searchQuery})
        )`
          : Prisma.empty;

        const subcategoryWhere = filters.subcategoryId
          ? Prisma.sql`AND p."subcategory_id" = ${filters.subcategoryId}`
          : Prisma.empty;

        const categoryWhere = filters.categoryId
          ? Prisma.sql`AND s."parentId" = ${filters.categoryId}`
          : Prisma.empty;

        const groupByClause = Prisma.sql`GROUP BY p."id"`;

        const orderClause = filters.search
          ? Prisma.sql`ORDER BY relevance_score DESC`
          : Prisma.empty;

        const limitClause = Prisma.sql`LIMIT ${take} OFFSET ${skip}`;

        const data = await this.prisma.client.$queryRaw`
      ${baseSelect}
      ${relevanceSelect}
      ${fromClause}
      ${baseWhere}
      ${searchWhere}
      ${subcategoryWhere}
      ${categoryWhere}
      ${groupByClause}
      ${orderClause}
      ${limitClause}
    `;

        const parseCharacteristics = (value: any) => {
          if (!value) {
            return [];
          }
          if (typeof value === 'string') {
            try {
              return JSON.parse(value);
            } catch {
              return [];
            }
          }
          return value;
        };

        const formattedData = (data as any[]).map((product) => ({
          ...product,
          total_count: Number(product.total_count),
          images: product.image_urls
            ? product.image_urls
                .split(',')
                .filter((url) => url.trim() !== '')
                .map((url) => ({
                  url: url,
                }))
            : [],
          characteristics: parseCharacteristics(product.characteristics),
        }));

        const totalCount =
          formattedData.length > 0 ? formattedData[0].total_count : 0;

        const result = this.toProductListDTO(
          formattedData as PrismaProductPayload[],
          totalCount,
          page,
          pageSize,
        );

        return Result.ok(result);
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  findDetailsByAlias: FindProductDetailsByAliasQuery = {
    execute: async (alias: string): Promise<Result<ProductDetailsDTO>> => {
      try {
        const product = await this.prisma.client.product.findFirst({
          where: { alias, deletedAt: null },
          include: {
            images: true,
            brand: true,
            subcategory: {
              include: { category: true },
            },
            characteristics: true,
          },
        });

        if (!product) {
          return Result.fail(ProductErrors.NOT_FOUND);
        }

        return Result.ok(this.toProductDetailsDTO(product as any));
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  findKpi: FindKpiQuery = {
    execute: async (): Promise<Result<KpiDTO>> => {
      try {
        const totalProducts = await this.prisma.client.product.count({
          where: { deletedAt: null },
        });
        const totalCategories = await this.prisma.client.category.count({
          where: { deletedAt: null },
        });
        const totalSubcategories = await this.prisma.client.subcategory.count({
          where: { deletedAt: null },
        });
        const totalBrands = await this.prisma.client.brand.count({
          where: { deletedAt: null },
        });

        return Result.ok({
          totalProducts,
          totalCategories,
          totalSubcategories,
          totalBrands,
        });
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  findLastCreatedProducts: FindLastCreatedProductsQuery = {
    execute: async (n: number): Promise<Result<RecentProductsDTO>> => {
      try {
        const products = await this.prisma.client.product.findMany({
          select: {
            name: true,
            sku: true,
            updatedAt: true,
          },
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: n,
        });

        return Result.ok(products);
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  findLastDeletedProducts: FindLastDeletedProductsQuery = {
    execute: async (n: number): Promise<Result<RecentProductsDTO>> => {
      try {
        const products = await this.prisma.client.product.findMany({
          select: {
            name: true,
            sku: true,
            updatedAt: true,
          },
          where: { deletedAt: { not: null } },
          orderBy: { deletedAt: 'desc' },
          take: n,
        });

        return Result.ok(products);
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  findCategorySubcategoryRelations: FindCategorySubcategoryRelationsQuery = {
    execute: async (): Promise<Result<any>> => {
      try {
        const categories = await this.prisma.client.category.findMany({
          where: { deletedAt: null },
          include: {
            subcategories: {
              where: { deletedAt: null },
            },
          },
        });

        const result = categories.map((category) => ({
          id: category.id,
          name: category.name,
          subcategories: category.subcategories.map((sub) => ({
            id: sub.id,
            name: sub.name,
          })),
        }));

        return Result.ok(result);
      } catch (error) {
        return Result.fail(error);
      }
    },
  };

  async delete(id: string): Promise<Result<void>> {
    const existing = await this.findById(id);
    if (existing.isFailure) {
      return Result.fail(ProductErrors.NOT_FOUND);
    }

    try {
      await this.prisma.client.product.update({
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
