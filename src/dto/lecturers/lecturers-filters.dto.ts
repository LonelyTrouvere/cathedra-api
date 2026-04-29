import { IsBooleanString, IsMongoId, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LecturersFiltersDto {
  @ApiPropertyOptional({ example: 'true' })
  @IsBooleanString()
  @IsOptional()
  active?: string;

  @ApiPropertyOptional({ example: '66c7f9f1b2e4a7b8c9d01234' })
  @IsOptional()
  @IsMongoId()
  position?: string;
}
