import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookFiltersDto {
  @ApiProperty({ example: 1, type: Number })
  @IsNotEmpty()
  @IsNumberString()
  page!: number;

  @ApiProperty({ example: 10, type: Number })
  @IsNotEmpty()
  @IsNumberString()
  limit!: number;

  @ApiPropertyOptional({ example: 'algorithms' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: '9780262046305' })
  @IsString()
  @IsOptional()
  isbn?: string;
}
