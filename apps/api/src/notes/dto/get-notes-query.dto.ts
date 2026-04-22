import { IsIn, IsOptional, IsUUID } from 'class-validator';

export class GetNotesQueryDto {
  @IsOptional()
  @IsIn(['lead', 'customer', 'property', 'task'])
  entity_type?: 'lead' | 'customer' | 'property' | 'task';

  @IsOptional()
  @IsUUID()
  entity_id?: string;
}
