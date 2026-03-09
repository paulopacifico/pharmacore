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
  CreateBrandUseCase,
  DeleteBrandUseCase,
  FindBrandByIdUseCase,
  UpdateBrandUseCase,
  CreateBrandIn,
  UpdateBrandIn,
  FindBrandByIdOut,
  FindManyBrandsUseCase,
  FindManyBrandsOut,
} from '@pharmacore/product';
import { BrandPrisma } from './brand.prisma';
import { RequirePermission } from 'src/shared/decorators/require-permission.decorator';
import { PERMISSIONS } from '@pharmacore/auth';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequirePermissionGuard } from 'src/shared/guards/require-permission.guard';

@Controller('brands')
@UseGuards(JwtAuthGuard, RequirePermissionGuard)
export class BrandController {
  constructor(private readonly brandPrisma: BrandPrisma) {}

  @Post()
  @RequirePermission(PERMISSIONS.PRODUCT.BRAND.CREATE)
  async create(@Body() data: CreateBrandIn): Promise<void> {
    const result = await new CreateBrandUseCase(this.brandPrisma).execute(data);

    if (result.isFailure) {
      throw new BadRequestException({ errors: result.errors });
    }

    return;
  }

  @Get()
  @RequirePermission(PERMISSIONS.PRODUCT.BRAND.READ)
  async getAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
  ): Promise<FindManyBrandsOut> {
    const result = await new FindManyBrandsUseCase(
      this.brandPrisma.findMany,
    ).execute({
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      search,
    });

    if (result.isFailure) {
      throw new NotFoundException({ errors: result.errors! });
    }

    return result.instance;
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.PRODUCT.BRAND.READ)
  async getById(@Param('id') id: string): Promise<FindBrandByIdOut> {
    const result = await new FindBrandByIdUseCase(
      this.brandPrisma.findDetailsById,
    ).execute({ id });

    if (result.isFailure) {
      throw new NotFoundException({ errors: result.errors });
    }

    return result.instance;
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.PRODUCT.BRAND.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() data: Omit<UpdateBrandIn, 'id'>,
  ): Promise<void> {
    const result = await new UpdateBrandUseCase(this.brandPrisma).execute({
      id,
      ...data,
    });

    if (result.isFailure) {
      throw new BadRequestException({ errors: result.errors! });
    }

    return;
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.PRODUCT.BRAND.DELETE)
  async delete(@Param('id') id: string): Promise<void> {
    const result = await new DeleteBrandUseCase(this.brandPrisma).execute({
      id,
    });

    if (result.isFailure) {
      throw new BadRequestException({ errors: result.errors! });
    }

    return;
  }
}
