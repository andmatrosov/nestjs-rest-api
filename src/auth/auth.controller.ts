import {Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";
import {RegisterDto} from "./dto/register.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UsePipes(new ValidationPipe())
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
     async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
}
