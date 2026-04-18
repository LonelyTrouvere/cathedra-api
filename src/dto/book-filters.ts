import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class BookFiltersDto {
  @IsNotEmpty()
  @IsNumberString()
  page!: number;

  @IsNotEmpty()
  @IsNumberString()
  limit!: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  isbn?: string;
}
