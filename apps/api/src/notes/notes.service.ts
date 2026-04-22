import { BadRequestException, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { notes } from '@crm/db';
import { DatabaseService } from '../database/database.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { GetNotesQueryDto } from './dto/get-notes-query.dto';

@Injectable()
export class NotesService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(dto: CreateNoteDto, userId: string) {
    return this.databaseService.db
      .insert(notes)
      .values({
        content: dto.content,
        entityType: dto.entityType,
        entityId: dto.entityId,
        createdByUserId: userId,
      })
      .returning();
  }

  findAll(query: GetNotesQueryDto, userId: string) {
    if (
      (query.entity_type && !query.entity_id) ||
      (!query.entity_type && query.entity_id)
    ) {
      throw new BadRequestException(
        'entity_type and entity_id must be provided together',
      );
    }

    return this.databaseService.db.query.notes.findMany({
      where:
        query.entity_type && query.entity_id
          ? and(
              eq(notes.entityType, query.entity_type),
              eq(notes.entityId, query.entity_id),
              eq(notes.createdByUserId, userId),
            )
          : eq(notes.createdByUserId, userId),
      orderBy: [desc(notes.createdAt)],
    });
  }
}
