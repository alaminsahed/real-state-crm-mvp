import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { properties } from '@crm/db';
import { DatabaseService } from '../database/database.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(dto: CreatePropertyDto, userId: string) {
    return this.databaseService.db
      .insert(properties)
      .values({
        title: dto.title,
        address: dto.address,
        price: dto.price,
        description: dto.description,
        ownerUserId: userId,
      })
      .returning();
  }

  findAll(userId: string) {
    return this.databaseService.db.query.properties.findMany({
      where: eq(properties.ownerUserId, userId),
      orderBy: [desc(properties.createdAt)],
    });
  }
}
