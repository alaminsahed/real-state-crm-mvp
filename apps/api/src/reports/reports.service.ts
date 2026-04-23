import { Injectable } from '@nestjs/common';
import { and, count, desc, eq, gte, lte, or, sql } from 'drizzle-orm';
import { leads } from '@crm/db';
import { DatabaseService } from '../database/database.service';
import type { ReportsQueryDto } from './dto/reports-query.dto';

function parseRangeStart(iso: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return new Date(`${iso}T00:00:00.000Z`);
  }
  return new Date(iso);
}

function parseRangeEnd(iso: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return new Date(`${iso}T23:59:59.999Z`);
  }
  return new Date(iso);
}

@Injectable()
export class ReportsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async leadSources(userId: string, query: ReportsQueryDto) {
    const visibility = or(
      eq(leads.createdByUserId, userId),
      eq(leads.assignedUserId, userId),
    );

    const conditions = [visibility];

    if (query.start_date) {
      conditions.push(gte(leads.createdAt, parseRangeStart(query.start_date)));
    }
    if (query.end_date) {
      conditions.push(lte(leads.createdAt, parseRangeEnd(query.end_date)));
    }

    const sourceExpr = sql<string>`coalesce(${leads.source}, 'unknown')`;

    const rows = await this.databaseService.db
      .select({
        source: sourceExpr,
        count: count(),
      })
      .from(leads)
      .where(and(...conditions))
      .groupBy(sourceExpr)
      .orderBy(desc(count()));

    return rows.map((row) => ({
      source: row.source,
      count: Number(row.count),
    }));
  }
}
