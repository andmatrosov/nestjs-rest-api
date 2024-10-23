import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getJWTConfig} from "../config/getJWTConfig";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => getJWTConfig(configService)
      }),
      UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
