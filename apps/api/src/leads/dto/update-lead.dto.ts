import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsIn(['new', 'contacted', 'qualified', 'won', 'lost'])
  status?: 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

  @IsOptional()
  @IsUUID()
  assignedUserId?: string;
}
