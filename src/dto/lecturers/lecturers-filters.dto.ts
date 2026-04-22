import { IsBooleanString, IsOptional } from 'class-validator';

export class LecturersFiltersDto {
  @IsBooleanString()
  @IsOptional()
  active?: string;
}
