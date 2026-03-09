import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ProductPrisma } from './product.prisma';
import {
  FindProductByAliasUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
  CreateProductIn,
  UpdateProductIn,
  FindStatusUseCase,
  FindManyProductsUseCase,
} from '@pharmacore/product';
import { CategoryPrisma } from 'src/category/category.prisma';
import { RequirePermission } from 'src/shared/decorators/require-permission.decorator';
import { PERMISSIONS } from '@pharmacore/auth';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequirePermissionGuard } from 'src/shared/guards/require-permission.guard';

@Controller('products')
@UseGuards(JwtAuthGuard, RequirePermissionGuard)
export class ProductController {
  constructor(
    private readonly repo: ProductPrisma,
    private readonly categoryRepo: CategoryPrisma,
  ) {}

  @Get('status')
  @RequirePermission(PERMISSIONS.PRODUCT.READ)
  async findStats() {
    const result = await new FindStatusUseCase(
      this.repo.findCategorySubcategoryRelations,
      this.repo.findKpi,
      this.repo.findLastCreatedProducts,
      this.repo.findLastDeletedProducts,
    ).execute();

    if (result.isFailure) {
      throw new NotFoundException({ errors: result.errors });
    }
    return result.instance;
  }

  @Get()
  @RequirePermission(PERMISSIONS.PRODUCT.READ)
  async find(
    @Query('categoryId') categoryId?: string,
    @Query('subcategoryId') subcategoryId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await new FindManyProductsUseCase(
      this.repo.findMany,
    ).execute({
      categoryId,
      subcategoryId,
      search: search ? String(search) : undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 15,
    });

    if (result.isFailure) {
      throw new NotFoundException({ errors: result.errors });
    }
    return result.instance;
  }

  @Get(':alias')
  @RequirePermission(PERMISSIONS.PRODUCT.READ)
  async findByAlias(@Param('alias') alias: string) {
    const result = await new FindProductByAliasUseCase(
      this.repo.findDetailsByAlias,
    ).execute({ alias });
    if (result.isFailure) {
      throw new NotFoundException({ errors: result.errors });
    }
    return result.instance;
  }

  @Post()
  @RequirePermission(PERMISSIONS.PRODUCT.CREATE)
  async create(@Body() createProductIn: CreateProductIn) {
    const result = await new CreateProductUseCase(
      this.repo,
      this.categoryRepo,
    ).execute(createProductIn);
    if (result.isFailure) {
      throw new BadRequestException({ errors: result.errors });
    }
    return;
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.PRODUCT.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateProductIn: UpdateProductIn,
  ) {
    const result = await new UpdateProductUseCase(
      this.repo,
      this.categoryRepo,
    ).execute({
      ...updateProductIn,
      id: id,
    });
    if (result.isFailure) {
      throw new BadRequestException({ errors: result.errors });
    }
    return;
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.PRODUCT.DELETE)
  async delete(@Param('id') id: string) {
    const result = await new DeleteProductUseCase(this.repo).execute({ id });
    if (result.isFailure) {
      throw new BadRequestException({ errors: result.errors });
    }
    return;
  }
}
