import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  fullName!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUUID()
  leadId?: string;
}
