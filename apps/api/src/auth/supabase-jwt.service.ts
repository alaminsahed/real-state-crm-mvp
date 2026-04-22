import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

@Injectable()
export class SupabaseJwtService {
  private readonly supabaseUrl: string;
  private readonly audience: string | undefined;
  private readonly anonKey: string | undefined;
  private readonly jwks;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    if (!url) {
      throw new Error('SUPABASE_URL is required');
    }

    this.supabaseUrl = url;
    this.audience =
      this.configService.get<string>('SUPABASE_JWT_AUDIENCE') ?? undefined;
    this.anonKey =
      this.configService.get<string>('SUPABASE_ANON_KEY') ?? undefined;
    this.jwks = createRemoteJWKSet(new URL(`${this.supabaseUrl}/auth/v1/keys`));
  }

  async verify(token: string): Promise<JWTPayload> {
    try {
      const result = await jwtVerify(token, this.jwks, {
        issuer: `${this.supabaseUrl}/auth/v1`,
        audience: this.audience,
      });
      return result.payload;
    } catch {
      if (!this.anonKey) {
        throw new UnauthorizedException('Invalid auth token');
      }

      const response = await fetch(`${this.supabaseUrl}/auth/v1/user`, {
        headers: {
          apikey: this.anonKey,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid auth token');
      }

      const user = (await response.json()) as {
        id?: string;
        email?: string;
        user_metadata?: Record<string, unknown>;
      };

      if (!user.id || !user.email) {
        throw new UnauthorizedException('Invalid auth token');
      }

      return {
        sub: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      };
    }
  }
}
