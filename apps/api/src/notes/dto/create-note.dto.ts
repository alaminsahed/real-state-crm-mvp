import { IsIn, IsString, IsUUID } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  content!: string;

  @IsIn(['lead', 'customer', 'property', 'task'])
  entityType!: 'lead' | 'customer' | 'property' | 'task';

  @IsUUID()
  entityId!: string;
}
