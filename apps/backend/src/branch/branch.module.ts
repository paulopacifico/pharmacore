import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { BranchController } from './branch.controller';
import { BranchPrisma } from './branch.prisma';

@Module({
  imports: [DbModule],
  controllers: [BranchController],
  providers: [BranchPrisma],
  exports: [BranchPrisma],
})
export class BranchModule {}
