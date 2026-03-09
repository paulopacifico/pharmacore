import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  FindAllCategoriesUseCase,
  FindCategoryByIdUseCase,
  UpdateCategoryUseCase,
  CreateCategoryIn,
  UpdateCategoryIn,
  FindAllCategoriesOut,
  FindCategoryByIdOut,
  FindSubcategoriesByCategoryUseCase,
  FindSubcategoriesByCategoryOut,
} from '@pharmacore/product';
import { CategoryPrisma } from './category.prisma';
import { RequirePermission } from 'src/shared/decorators/require-permission.decorator';
import { PERMISSIONS } from '@pharmacore/auth';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequirePermissionGuard } from 'src/shared/guards/require-permission.guard';
@Controller('categories')
@UseGuards(JwtAuthGuard, RequirePermissionGuard)
export class CategoryController {
  constructor(private readonly categoryPrisma: CategoryPrisma) {}

  @Post()
  @RequirePermission(PERMISSIONS.PRODUCT.CATEGORY.CREATE)
  async create(@Body() data: CreateCategoryIn): Promise<void> {
    const result = await new CreateCategoryUseCase(this.categoryPrisma).execute(
      data,
    );

    if (result.isFailure) {
      throw new BadRequestException({ errors: result.errors });
    }

    return;
  }

  @Get()
  @RequirePermission(PERMISSIONS.PRODUCT.CATEGORY.READ)
  async getAll(
    @Query('getSubcategories') getSubcategories?: string,
  ): Promise<FindAllCategoriesOut> {
    const result = await new FindAllCategoriesUseCase(
      this.categoryPrisma.findMany,
    ).execute({
      getSubcategories: getSubcategories === 'true',
    });

    if (result.isFailure) {
      throw new NotFoundException({ errors: result.errors! });
    }

    return result.instance;
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.PRODUCT.CATEGORY.READ)
  async getById(
    @Param('id') id: string,
    @Query('getSubcategories') getSubcategories?: string,
  ): Promise<FindCategoryByIdOut> {
    const result = await new FindCategoryByIdUseCase(
      this.categoryPrisma.findDetailsById,
    ).execute({ id, getSubcategories: getSubcategories === 'true' });

    if (result.isFailure) {
      throw new NotFoundException({ errors: result.errors });
    }

    return result.instance;
  }

  @Get(':id/subcategories')
  @RequirePermission(PERMISSIONS.PRODUCT.CATEGORY.READ)
  async getSubcategoriesById(
    @Param('id') id: string,
  ): Promise<FindSubcategoriesByCategoryOut> {
    const result = await new FindSubcategoriesByCategoryUseCase(
      this.categoryPrisma.findSubcategoriesByCategoryId,
    ).execute({ categoryId: id });

    if (result.isFailure) {
      throw new NotFoundException({ errors: result.errors });
    }

    return result.instance;
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.PRODUCT.CATEGORY.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() data: Omit<UpdateCategoryIn, 'id'>,
  ): Promise<void> {
    const result = await new UpdateCategoryUseCase(this.categoryPrisma).execute(
      {
        id,
        ...data,
      },
    );

    if (result.isFailure) {
      throw new BadRequestException({ errors: result.errors! });
    }

    return;
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.PRODUCT.CATEGORY.DELETE)
  async delete(@Param('id') id: string): Promise<void> {
    const result = await new DeleteCategoryUseCase(this.categoryPrisma).execute(
      { id },
    );

    if (result.isFailure) {
      throw new BadRequestException({ errors: result.errors! });
    }

    return;
  }
}
