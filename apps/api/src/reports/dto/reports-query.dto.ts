import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class ReportsQueryDto {
  @ApiPropertyOptional({
    description: 'Inclusive lower bound on lead created_at (ISO 8601)',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Inclusive upper bound on lead created_at (ISO 8601)',
    example: '2026-01-31',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
