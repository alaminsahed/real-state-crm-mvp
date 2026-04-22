import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDb } from '@crm/db';

@Injectable()
export class DatabaseService {
  readonly db;

  constructor(configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    this.db = getDb(databaseUrl);
  }
}
