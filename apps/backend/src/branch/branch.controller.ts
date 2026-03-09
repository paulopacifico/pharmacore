import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  CreateBranchUseCase,
  UpdateBranchUseCase,
  FindBranchByIdUseCase,
  FindManyBranchesUseCase,
  DeleteBranchUseCase,
  FindBranchOverviewUseCase,
  CreateBranchIn,
  UpdateBranchIn,
  FindBranchByIdOut,
  BranchOverviewDTO,
} from '@pharmacore/branch';
import { BranchPrisma } from './branch.prisma';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PERMISSIONS } from '@pharmacore/auth';
import { RequirePermission } from 'src/shared/decorators/require-permission.decorator';
import { RequirePermissionGuard } from 'src/shared/guards/require-permission.guard';
import { FindManyBranchesOut } from '@pharmacore/branch';

@Controller('branches')
@UseGuards(JwtAuthGuard, RequirePermissionGuard)
export class BranchController {
  constructor(private readonly branchPrisma: BranchPrisma) {}

  @Post()
  @HttpCode(201)
  @RequirePermission(PERMISSIONS.BRANCH.CREATE)
  async create(@Body() data: CreateBranchIn): Promise<void> {
    const useCase = new CreateBranchUseCase(this.branchPrisma);
    const result = await useCase.execute(data);

    if (result.isFailure) {
      throw new BadRequestException(result.errors);
    }

    return;
  }

  @Get()
  @RequirePermission(PERMISSIONS.BRANCH.READ)
  async find(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('name') name?: string,
  ): Promise<FindManyBranchesOut> {
    const parsedPage = Number(page);
    const parsedPageSize = Number(pageSize);

    const useCase = new FindManyBranchesUseCase(this.branchPrisma.findMany);
    const result = await useCase.execute({
      page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
      pageSize:
        Number.isFinite(parsedPageSize) && parsedPageSize > 0
          ? Math.min(parsedPageSize, 100)
          : 10,
      name: name?.trim() || undefined,
    });

    if (result.isFailure) {
      return {
        data: [],
        meta: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }

    return result.instance;
  }

  @Get('overview')
  @RequirePermission(PERMISSIONS.BRANCH.READ)
  async getOverview(): Promise<BranchOverviewDTO> {
    const useCase = new FindBranchOverviewUseCase(this.branchPrisma.findOverview);
    const result = await useCase.execute();

    if (result.isFailure) {
      throw new BadRequestException(result.errors);
    }

    return result.instance;
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.BRANCH.READ)
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<FindBranchByIdOut> {
    const useCase = new FindBranchByIdUseCase(
      this.branchPrisma.findDetailsById,
    );
    const result = await useCase.execute({ id });

    if (result.isFailure) {
      throw new NotFoundException(result.errors);
    }

    return result.instance;
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.BRANCH.UPDATE)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: Omit<UpdateBranchIn, 'id'>,
  ): Promise<void> {
    const useCase = new UpdateBranchUseCase(this.branchPrisma);
    const result = await useCase.execute({ id, ...data });

    if (result.isFailure) {
      throw new BadRequestException(result.errors);
    }

    return;
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission(PERMISSIONS.BRANCH.DELETE)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    const useCase = new DeleteBranchUseCase(this.branchPrisma);
    const result = await useCase.execute({ id });

    if (result.isFailure) {
      throw new NotFoundException(result.errors);
    }
  }
}
