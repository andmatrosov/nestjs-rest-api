import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";
import { Strategy, ExtractJwt } from "passport-jwt";
import {Injectable} from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (
        private readonly configService: ConfigService,
        private readonly userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_SECRET_KEY"),
        })
    }

    async validate({ email }: { email: string }) {
        return await this.userService.findUserByEmail(email);

    }
}