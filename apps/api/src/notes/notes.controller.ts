import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import type { RequestUser } from '../common/request-user.interface';
import { CreateNoteDto } from './dto/create-note.dto';
import { GetNotesQueryDto } from './dto/get-notes-query.dto';
import { NotesService } from './notes.service';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() dto: CreateNoteDto, @CurrentUser() user: RequestUser) {
    const [note] = await this.notesService.create(dto, user.id);
    return note;
  }

  @Get()
  findAll(@Query() query: GetNotesQueryDto, @CurrentUser() user: RequestUser) {
    return this.notesService.findAll(query, user.id);
  }
}
