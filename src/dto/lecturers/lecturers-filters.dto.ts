import { IsBooleanString, IsMongoId, IsOptional } from 'class-validator';

export class LecturersFiltersDto {
  @IsBooleanString()
  @IsOptional()
  active?: string;

  @IsOptional()
  @IsMongoId()
  position?: string;
}
