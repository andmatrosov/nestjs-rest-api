import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {CATEGORY_MODEL_NAME} from "./categories.constants";
import {CategoriesSchema} from "./categories.model";
import {CategoriesService} from "./categories.service";
import {CategoriesController} from "./categories.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CATEGORY_MODEL_NAME, schema: CategoriesSchema }
        ]),
    ],
    providers: [CategoriesService],
    controllers: [CategoriesController],
})
export class CategoriesModule {}
