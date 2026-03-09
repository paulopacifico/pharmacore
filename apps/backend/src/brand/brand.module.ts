import { Module } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { BrandPrisma } from './brand.prisma';
import { BrandController } from './brand.controller';

@Module({
  providers: [BrandPrisma, PrismaService],
  controllers: [BrandController],
  exports: [BrandPrisma],
})
export class BrandModule {}
