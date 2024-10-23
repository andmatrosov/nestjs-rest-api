import {Inject, Injectable} from '@nestjs/common';
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {MFile} from "./mfile.class";
import {path} from "app-root-path";
import {ensureDir, readdir, writeFile} from "fs-extra";
import {format} from "date-fns";
import {deleteCache} from "../utils/deleteCache";
import { Cache } from "cache-manager";
import sharp from 'sharp';


@Injectable()
export class FileService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache ) {
    }

    async saveFiles(files: MFile[], folder: string){
        const dateFolder = format(new Date(), "yyyy-MM-dd");
        const uploadFolder = `${path}/assets/${folder}/${dateFolder}`;
        await ensureDir(uploadFolder);
        const res = [];

        for (const file of files) {
            await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
            res.push({
                url: `${dateFolder}/${file.originalname}`,
                name: file.originalname
            });
        }

        await deleteCache(this.cacheManager, `${folder}`);
        return res;
    }

    async convertToWebP(file: Buffer): Promise<Buffer> {
        return sharp(file)
            .webp()
            .toBuffer()
    }

    async getImages(folder: string): Promise<string[]> {
        const cacheKey = `${folder}`;
        const cachedImages: string[] = await this.cacheManager.get(cacheKey);

        if (cachedImages) {
            return cachedImages;
        }

        const uploadFolder = `${path}/assets/${folder}`;
        await ensureDir(uploadFolder);
        const res: string[] = [];

        const dateFolders = await readdir(uploadFolder);

        for (const dateFolder of dateFolders ) {
            const images = await readdir(`${uploadFolder}/${dateFolder}`);

            for (const image of images) {
                if (image.includes('webp')) {
                    res.push(`${dateFolder}/${image}`);
                }
            }
        }

        await this.cacheManager.set(cacheKey, res, 60 * 60 * 1000);
        return res;
    }
}
