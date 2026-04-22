import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { customers } from '@crm/db';
import { DatabaseService } from '../database/database.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(dto: CreateCustomerDto, userId: string) {
    return this.databaseService.db
      .insert(customers)
      .values({
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        leadId: dto.leadId,
        ownerUserId: userId,
      })
      .returning();
  }

  findAll(userId: string) {
    return this.databaseService.db.query.customers.findMany({
      where: eq(customers.ownerUserId, userId),
      orderBy: [desc(customers.createdAt)],
    });
  }
}
