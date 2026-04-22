import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthenticatedRequest } from '../common/authenticated-request.interface';
import { SupabaseJwtService } from './supabase-jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly supabaseJwtService: SupabaseJwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = await this.supabaseJwtService.verify(token);

    const authUserId = payload.sub;
    const email = payload.email;

    if (!authUserId || !email || typeof email !== 'string') {
      throw new UnauthorizedException(
        'Token payload is missing required claims',
      );
    }

    const user = await this.usersService.getOrCreate(
      authUserId,
      email,
      typeof (payload.user_metadata as { full_name?: unknown } | undefined)
        ?.full_name === 'string'
        ? (payload.user_metadata as { full_name: string }).full_name
        : undefined,
    );

    request.user = {
      id: user.id,
      authUserId,
      email,
    };

    return true;
  }
}
