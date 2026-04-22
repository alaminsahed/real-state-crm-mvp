import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { users } from '@crm/db';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getOrCreate(authUserId: string, email: string, fullName?: string) {
    const existing = await this.databaseService.db.query.users.findFirst({
      where: eq(users.authUserId, authUserId),
    });

    if (existing) {
      return existing;
    }

    const [created] = await this.databaseService.db
      .insert(users)
      .values({ authUserId, email, fullName })
      .returning();

    return created;
  }
}
