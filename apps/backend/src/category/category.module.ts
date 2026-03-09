import { Module } from '@nestjs/common';
import { CategoryPrisma } from './category.prisma';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  providers: [CategoryPrisma, PrismaService],
  controllers: [CategoryController],
  exports: [CategoryPrisma],
})
export class CategoryModule {}
