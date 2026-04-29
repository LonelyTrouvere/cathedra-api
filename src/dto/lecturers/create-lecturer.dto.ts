import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Positions } from 'src/schemas/positions';

export class CreateLecturerDto {
  @ApiProperty({ example: 'Ada' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'ada-lovelace' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiPropertyOptional({ example: 'Byron' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ example: 'Lovelace' })
  @IsString()
  @IsNotEmpty()
  surname!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  active!: boolean;

  @ApiProperty({ enum: Positions, example: Positions.PROFESSOR })
  @IsNotEmpty()
  @IsEnum(Positions)
  position!: string;

  @ApiPropertyOptional({ example: ['PhD', 'MSc'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  titles?: string[];

  @ApiPropertyOptional({ example: ['Paper 1', 'Paper 2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  publications?: string[];

  @ApiPropertyOptional({ example: ['Algorithms', 'Data Structures'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  courses?: string[];

  @ApiPropertyOptional({ example: ['Thesis A', 'Thesis B'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  thesisSupervisions?: string[];

  @ApiPropertyOptional({ example: ['Computer Science'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @ApiPropertyOptional({
    example: ['Born in London', 'Worked at Babbage Institute'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  personalHistory?: string[];
}
