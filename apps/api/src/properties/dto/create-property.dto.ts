import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  title!: string;

  @IsString()
  address!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
