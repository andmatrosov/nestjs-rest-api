import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { genSalt, hash } from "bcryptjs";
import { deleteCache } from "../utils/deleteCache";
import {USER_MODEL_NAME, USER_NOT_FOUND} from "./user.constants";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { UsersDocument } from "./users.model";
import { Model } from "mongoose";
import { Cache } from "cache-manager";
import { RegisterDto } from "../auth/dto/register.dto";


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(USER_MODEL_NAME) private readonly  userModel: Model<UsersDocument>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async createUser(createUserDto: RegisterDto) {
        const salt = await genSalt(10);
        const hashedPassword = await hash(createUserDto.password, salt);

        const user = new this.userModel({
            ...createUserDto,
            passwordHash: hashedPassword
        });

        await user.save();
        await deleteCache(this.cacheManager, 'users');
        const { passwordHash, ...result } = user.toObject();

        return result;
    }

    async findUserByEmail(email: string): Promise<UsersDocument> {
        const cacheKey = `users-${email}`;
        const cachedUser: UsersDocument = await this.cacheManager.get(cacheKey);

        if (cachedUser) {
            return cachedUser;
        }

        const user = await this.userModel.findOne({ email })
            .lean()
            .exec();

        if (!user) {
            throw new NotFoundException(USER_NOT_FOUND)
        }

        await this.cacheManager.set(cacheKey, user);

        return user as UsersDocument;
    }
}
