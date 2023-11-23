import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from './database/data-source';
import { UserSubscriber } from './database/entities/subscriber/user.subscriber';
import { UserModule } from './resource/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './resource/auth/auth.guard';
import { AuthModule } from './resource/auth/auth.module';
import { CustomerModule } from './resource/customer/customer.module';
import { WarehouseModule } from './resource/warehouse/warehouse.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './.env' }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        return await dataSource.initialize();
      },
    }),
    UserModule,
    AuthModule,
    CustomerModule,
    WarehouseModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    UserSubscriber
  ],
})
export class AppModule { }
