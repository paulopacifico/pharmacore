import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { BranchModule } from './branch/branch.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ActiveLogInterceptor } from './shared/interceptors/activity-log-interceptor';

@Module({
  imports: [
    AuthModule,
    DbModule,
    BranchModule,
    CategoryModule,
    BrandModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ActiveLogInterceptor,
    },
  ],
})
export class AppModule {}
