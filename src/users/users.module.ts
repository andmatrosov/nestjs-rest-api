import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { USER_MODEL_NAME } from "./user.constants";
import { UsersSchema } from "./users.model";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: USER_MODEL_NAME, schema: UsersSchema }
      ])
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
