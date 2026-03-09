import { readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { PrismaClient } from '../generated/prisma/client';
import { SeedLogger } from './seed-logger';
import { ProductCharacteristicProps } from '@pharmacore/product/dist/product/model/product-characteristic.vo';

type BrandSeedItem = {
  alias: string;
  name: string;
};

type BrandsSeedFile = {
  total: number;
  items: BrandSeedItem[];
};

type SubcategorySeedItem = {
  alias: string;
  name: string;
  order: number;
};

type CategorySeedItem = {
  alias: string;
  name: string;
  subcategories: SubcategorySeedItem[];
};

type CategoriesSeedFile = {
  total: number;
  items: CategorySeedItem[];
};

type ProductImageSeedItem = {
  url: string;
};

type ProductCharacteristicsSeed =
  | ProductCharacteristicProps[]
  | Record<string, unknown>;

type ProductSeedItem = {
  alias: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  brandAlias: string;
  subcategoryAlias: string;
  images: ProductImageSeedItem[];
  characteristics?: ProductCharacteristicsSeed;
};

type ProductChunkFile = {
  chunk: number;
  totalChunks: number;
  total: number;
  items: ProductSeedItem[];
};

type ProductIndexFile = {
  total: number;
  totalChunks: number;
  files: Array<{
    file: string;
    total: number;
  }>;
};

type SeedStats = {
  brands: number;
  categories: number;
  subcategories: number;
  productsCreated: number;
  productsUpdated: number;
  productsSkipped: number;
};

const DATA_DIR = path.resolve(__dirname, 'data/product');
const BRANDS_FILE = path.join(DATA_DIR, 'brands.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories-subcategories.json');
const PRODUCTS_INDEX_FILE = path.join(DATA_DIR, 'products-index.json');
const PRODUCT_PROGRESS_EVERY = 50;

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

function productHasField(prisma: PrismaClient, fieldName: string): boolean {
  const runtimeDataModel = (prisma as unknown as Record<string, unknown>)
    ._runtimeDataModel as
    | {
        models?: Record<
          string,
          {
            fields?: Array<{ name: string }>;
          }
        >;
      }
    | undefined;

  const productFields = runtimeDataModel?.models?.Product?.fields ?? [];
  return productFields.some((field) => field.name === fieldName);
}

function normalizeCharacteristics(
  characteristics?: ProductCharacteristicsSeed,
): ProductCharacteristicProps[] {
  if (!characteristics) {
    return [];
  }

  if (Array.isArray(characteristics)) {
    return characteristics
      .map((item) => ({
        name: String((item as any)?.name ?? '').trim(),
        value: String((item as any)?.value ?? '').trim(),
      }))
      .filter((item) => item.name && item.value);
  }

  return Object.entries(characteristics)
    .map(([name, value]) => ({
      name: String(name ?? '').trim(),
      value: String(value ?? '').trim(),
    }))
    .filter((item) => item.name && item.value);
}

function toUniqueImageUrls(images: ProductImageSeedItem[]): string[] {
  const unique = new Set<string>();

  for (const image of images) {
    const url = String(image?.url ?? '').trim();
    if (!url) {
      continue;
    }
    unique.add(url);
  }

  return [...unique];
}

export async function seedProductModule(prisma: PrismaClient) {
  const logger = new SeedLogger('product');
  const db = prisma as unknown as Record<string, any>;

  assertDelegate(db, 'brand');
  assertDelegate(db, 'category');
  assertDelegate(db, 'subcategory');
  assertDelegate(db, 'product');
  assertDelegate(db, 'productImage');
  assertDelegate(db, 'productCharacteristic');

  const [brandsSeed, categoriesSeed, productsIndex] = await Promise.all([
    readJsonFile<BrandsSeedFile>(BRANDS_FILE),
    readJsonFile<CategoriesSeedFile>(CATEGORIES_FILE),
    readJsonFile<ProductIndexFile>(PRODUCTS_INDEX_FILE),
  ]);

  logger.info('Iniciando seed do módulo de produtos', {
    brands: brandsSeed.total,
    categories: categoriesSeed.total,
    productFiles: productsIndex.totalChunks,
    products: productsIndex.total,
  });

  const stats: SeedStats = {
    brands: 0,
    categories: 0,
    subcategories: 0,
    productsCreated: 0,
    productsUpdated: 0,
    productsSkipped: 0,
  };

  logger.info('Persistindo marcas por alias');
  await db.brand.createMany({
    data: brandsSeed.items.map((brand) => ({
      alias: brand.alias,
      name: brand.name,
    })),
    skipDuplicates: true,
  });
  stats.brands = brandsSeed.items.length;
  logger.progress('Marcas processadas', stats.brands, brandsSeed.items.length);

  logger.info('Persistindo categorias e subcategorias em transação única');
  await prisma.$transaction(async (tx) => {
    const txDb = tx as unknown as Record<string, any>;

    let processedCategories = 0;
    let processedSubcategories = 0;

    for (const category of categoriesSeed.items) {
      const persistedCategory = await txDb.category.upsert({
        where: { alias: category.alias },
        create: {
          alias: category.alias,
          name: category.name,
        },
        update: {
          name: category.name,
        },
      });

      processedCategories += 1;

      for (const subcategory of category.subcategories) {
        await txDb.subcategory.upsert({
          where: { alias: subcategory.alias },
          create: {
            alias: subcategory.alias,
            name: subcategory.name,
            order: subcategory.order,
            parentId: persistedCategory.id,
          },
          update: {
            name: subcategory.name,
            order: subcategory.order,
            parentId: persistedCategory.id,
          },
        });

        processedSubcategories += 1;
      }
    }

    stats.categories = processedCategories;
    stats.subcategories = processedSubcategories;
  });

  logger.info('Categorias e subcategorias persistidas', {
    categories: stats.categories,
    subcategories: stats.subcategories,
  });

  logger.info(
    'Carregando mapas por alias (marcas/categorias/subcategorias) para relacionamentos',
  );

  const [persistedBrands, persistedCategories, persistedSubcategories] =
    await Promise.all([
      db.brand.findMany({
        select: { id: true, alias: true },
      }),
      db.category.findMany({
        select: { id: true, alias: true },
      }),
      db.subcategory.findMany({
        select: { id: true, alias: true, parentId: true },
      }),
    ]);

  const brandByAlias = new Map<string, string>(
    persistedBrands.map((brand: { id: string; alias: string }) => [
      brand.alias,
      brand.id,
    ]),
  );
  const categoryByAlias = new Map<string, string>(
    persistedCategories.map((category: { id: string; alias: string }) => [
      category.alias,
      category.id,
    ]),
  );
  const subcategoryByAlias = new Map<string, { id: string; parentId: string }>(
    persistedSubcategories.map(
      (subcategory: { id: string; alias: string; parentId: string }) => [
        subcategory.alias,
        { id: subcategory.id, parentId: subcategory.parentId },
      ],
    ),
  );

  const hasBrandRelation = productHasField(prisma, 'brandId');
  if (!hasBrandRelation) {
    logger.warn(
      'Campo Product.brandId não encontrado no Prisma Client gerado. Produto será persistido sem relação de marca até sincronizar o client.',
    );
  }

  logger.info('Iniciando persistência dos produtos');
  let processedProducts = 0;

  for (const [fileIndex, file] of productsIndex.files.entries()) {
    const chunkPath = path.join(DATA_DIR, file.file);
    const chunk = await readJsonFile<ProductChunkFile>(chunkPath);

    logger.info('Processando arquivo de produtos', {
      file: file.file,
      filePosition: `${fileIndex + 1}/${productsIndex.files.length}`,
      chunkTotal: chunk.total,
    });

    const chunkAliases = chunk.items.map((item) => item.alias);
    const existingProducts = await db.product.findMany({
      where: {
        alias: {
          in: chunkAliases,
        },
      },
      select: {
        alias: true,
      },
    });
    const existingAliases = new Set<string>(
      existingProducts.map((product: { alias: string }) => product.alias),
    );

    for (const item of chunk.items) {
      const brandId = brandByAlias.get(item.brandAlias);
      const subcategoryRef = subcategoryByAlias.get(item.subcategoryAlias);
      const characteristics = normalizeCharacteristics(item.characteristics);

      if (!brandId || !subcategoryRef) {
        stats.productsSkipped += 1;
        processedProducts += 1;

        logger.warn('Produto ignorado por relacionamento ausente', {
          productAlias: item.alias,
          missingBrand: !brandId,
          missingSubcategory: !subcategoryRef,
        });

        if (
          processedProducts % PRODUCT_PROGRESS_EVERY === 0 ||
          processedProducts === productsIndex.total
        ) {
          logger.progress(
            'Produtos processados',
            processedProducts,
            productsIndex.total,
            {
              created: stats.productsCreated,
              updated: stats.productsUpdated,
              skipped: stats.productsSkipped,
            },
          );
        }
        continue;
      }

      const productData: Record<string, unknown> = {
        alias: item.alias,
        name: item.name,
        description: item.description,
        price: item.price,
        sku: item.sku,
        subcategoryId: subcategoryRef.id,
      };

      if (hasBrandRelation) {
        productData.brandId = brandId;
      }

      const persistedProduct = await db.product.upsert({
        where: { alias: item.alias },
        create: productData,
        update: productData,
        select: { id: true },
      });

      const imageUrls = toUniqueImageUrls(item.images);

      await db.productImage.deleteMany({
        where: { productId: persistedProduct.id },
      });

      if (imageUrls.length > 0) {
        await db.productImage.createMany({
          data: imageUrls.map((url) => ({
            productId: persistedProduct.id,
            url,
          })),
        });
      }

      await db.productCharacteristic.deleteMany({
        where: { productId: persistedProduct.id },
      });

      if (characteristics.length > 0) {
        await db.productCharacteristic.createMany({
          data: characteristics.map((characteristic) => ({
            productId: persistedProduct.id,
            name: characteristic.name,
            value: characteristic.value,
          })),
        });
      }

      if (existingAliases.has(item.alias)) {
        stats.productsUpdated += 1;
      } else {
        stats.productsCreated += 1;
      }

      processedProducts += 1;

      if (
        processedProducts % PRODUCT_PROGRESS_EVERY === 0 ||
        processedProducts === productsIndex.total
      ) {
        logger.progress(
          'Produtos processados',
          processedProducts,
          productsIndex.total,
          {
            created: stats.productsCreated,
            updated: stats.productsUpdated,
            skipped: stats.productsSkipped,
          },
        );
      }
    }
  }

  logger.info('Seed de produtos concluído', {
    brands: stats.brands,
    categories: stats.categories,
    subcategories: stats.subcategories,
    created: stats.productsCreated,
    updated: stats.productsUpdated,
    skipped: stats.productsSkipped,
    categoryAliasMap: categoryByAlias.size,
    subcategoryAliasMap: subcategoryByAlias.size,
    brandAliasMap: brandByAlias.size,
  });
}
