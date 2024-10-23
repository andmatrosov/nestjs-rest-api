import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {UsersDocument} from "../users/users.model";
import {USER_NOT_FOUND, WRONG_PASSWORD} from "../users/user.constants";
import {compare} from "bcryptjs";
import {LoginDto} from "./dto/login.dto";
import {RegisterDto} from "./dto/register.dto";
import {EMAIL_NOT_UNIQUE} from "./auth.constants";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<UsersDocument> {
        const user = await this.usersService.findUserByEmail(email);

        const isCorrect = await compare(password,  user.passwordHash);

        if (!isCorrect) {
            throw new UnauthorizedException(WRONG_PASSWORD);
        }

        return user;

    }

    async login({email, password}: LoginDto) {
        await this.validateUser(email, password);
        const payload = { email };

        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: '24h'
            }),
        }
    }

    async register(dto: RegisterDto) {
        const isEmailUsed = await this.usersService.findUserByEmail(dto.email);

        if (isEmailUsed) throw new ConflictException(EMAIL_NOT_UNIQUE);

        return this.usersService.createUser(dto);
    }
}
