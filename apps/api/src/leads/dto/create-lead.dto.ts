import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  fullName!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsUUID()
  assignedUserId?: string;
}
