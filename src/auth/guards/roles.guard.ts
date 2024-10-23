import {CanActivate, ExecutionContext} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "../decorators/roles.decorator";

export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requireRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requireRoles) return false;

        const { user } = context.switchToHttp().getRequest();
        return requireRoles.some(role =>  user.roles?.includes(role));
    }
}