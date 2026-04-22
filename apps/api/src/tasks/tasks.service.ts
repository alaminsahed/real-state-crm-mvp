import { Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, or } from 'drizzle-orm';
import { tasks } from '@crm/db';
import { DatabaseService } from '../database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(dto: CreateTaskDto, userId: string) {
    return this.databaseService.db
      .insert(tasks)
      .values({
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assignedUserId: dto.assignedUserId ?? userId,
        createdByUserId: userId,
      })
      .returning();
  }

  findAll(userId: string) {
    return this.databaseService.db.query.tasks.findMany({
      where: or(
        eq(tasks.createdByUserId, userId),
        eq(tasks.assignedUserId, userId),
      ),
      orderBy: [desc(tasks.createdAt)],
    });
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    const existing = await this.databaseService.db.query.tasks.findFirst({
      where: and(
        eq(tasks.id, id),
        or(eq(tasks.createdByUserId, userId), eq(tasks.assignedUserId, userId)),
      ),
    });

    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    const [updated] = await this.databaseService.db
      .update(tasks)
      .set({
        ...dto,
        status: dto.done ? 'done' : dto.status,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    return updated;
  }
}
