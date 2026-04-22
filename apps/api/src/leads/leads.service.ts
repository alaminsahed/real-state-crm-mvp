import { Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, or } from 'drizzle-orm';
import { customers, leads } from '@crm/db';
import { DatabaseService } from '../database/database.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(dto: CreateLeadDto, userId: string) {
    return this.databaseService.db
      .insert(leads)
      .values({
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        source: dto.source,
        assignedUserId: dto.assignedUserId,
        createdByUserId: userId,
      })
      .returning();
  }

  findAll(userId: string) {
    return this.databaseService.db.query.leads.findMany({
      where: or(
        eq(leads.createdByUserId, userId),
        eq(leads.assignedUserId, userId),
      ),
      orderBy: [desc(leads.createdAt)],
    });
  }

  async findOne(id: string, userId: string) {
    const lead = await this.databaseService.db.query.leads.findFirst({
      where: and(
        eq(leads.id, id),
        or(eq(leads.createdByUserId, userId), eq(leads.assignedUserId, userId)),
      ),
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async update(id: string, dto: UpdateLeadDto, userId: string) {
    await this.findOne(id, userId);

    const [updated] = await this.databaseService.db
      .update(leads)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, id))
      .returning();

    return updated;
  }

  async convertToCustomer(leadId: string, userId: string) {
    const lead = await this.findOne(leadId, userId);

    const [customer] = await this.databaseService.db
      .insert(customers)
      .values({
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        leadId: lead.id,
        ownerUserId: lead.assignedUserId ?? lead.createdByUserId,
      })
      .returning();

    await this.databaseService.db
      .update(leads)
      .set({ status: 'won', updatedAt: new Date() })
      .where(eq(leads.id, leadId));

    return customer;
  }
}
