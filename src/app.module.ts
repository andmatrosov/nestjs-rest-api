import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import { UsersModule } from './users/users.module';
import {CacheModule} from "@nestjs/cache-manager";
import { AuthModule } from './auth/auth.module';
import { FileController } from './file/file.controller';
import { FileModule } from './file/file.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';


@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      }),
      MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
              uri: configService.get('MONGO_LINK'),
          }),
          inject: [ConfigService],
      }),
      CacheModule.register({
          isGlobal: true,
          ttl: 60 * 60 * 1000,
          max: 1000,
      }),
      UsersModule,
      AuthModule,
      FileModule,
      CategoriesModule
  ],
  controllers: [FileController, CategoriesController],
  providers: [CategoriesService],
})
export class AppModule {}
