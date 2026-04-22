import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SupabaseJwtService } from './supabase-jwt.service';

@Module({
  imports: [UsersModule],
  providers: [SupabaseJwtService, JwtAuthGuard],
  exports: [JwtAuthGuard, SupabaseJwtService, UsersModule],
})
export class AuthModule {}
