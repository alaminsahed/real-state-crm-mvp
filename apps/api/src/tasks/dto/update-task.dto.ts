import { IsBoolean, IsIn, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsBoolean()
  done?: boolean;

  @IsOptional()
  @IsIn(['todo', 'in_progress', 'done'])
  status?: 'todo' | 'in_progress' | 'done';
}
