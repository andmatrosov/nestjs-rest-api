import {Controller, Get, HttpCode, HttpStatus, Post, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import {FileService} from "./file.service";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {MFile} from "./mfile.class";

@Controller('file')
export class FileController {
    constructor(
        private readonly fileService: FileService,
    ) {}

    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('upload')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFiles() file: Express.Multer.File) {
        const saveFiles: MFile[] = [file];

        if (file?.mimetype.includes('image')) {
            const webP = await this.fileService.convertToWebP(file.buffer);
            saveFiles.push(new MFile({ originalname: `${file.originalname.split('.')[0]}.webp`, buffer: webP}));
        }

        return this.fileService.saveFiles(saveFiles, 'products');
    }

    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('images')
    async getImage() {
        return await this.fileService.getImages('products');
    }
}
