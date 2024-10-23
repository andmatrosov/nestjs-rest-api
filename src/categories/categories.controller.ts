import {Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {CategoriesService} from "./categories.service";
import {Roles} from "../auth/decorators/roles.decorator";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {CategoriesDto} from "./dto/categories.dto";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    async createCategory(@Body() category: CategoriesDto) {
        return this.categoriesService.createCategory(category);
    }

    @Get()
    async getAllCategories() {
        return await this.categoriesService.getAllCategories();
    }
}
