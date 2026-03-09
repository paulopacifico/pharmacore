import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductPrisma } from './product.prisma';
import { PrismaService } from 'src/db/prisma.service';
import { CategoryPrisma } from 'src/category/category.prisma';
@Module({
  controllers: [ProductController],
  providers: [ProductPrisma, PrismaService, CategoryPrisma],
})
export class ProductModule {}
