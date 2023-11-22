import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from './database/data-source';
import { UserModule } from './resource/user/user.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
