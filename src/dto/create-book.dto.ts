import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthorDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '66c7f9f1b2e4a7b8c9d01234' })
  @IsMongoId()
  @IsOptional()
  lecturerId?: string;
}

export class CreateBookDto {
  @ApiProperty({ example: 'Introduction to Algorithms' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'MIT Press' })
  @IsString()
  @IsNotEmpty()
  publisher!: string;

  @ApiProperty({ example: 'en' })
  @IsString()
  @IsNotEmpty()
  language!: string;

  @ApiProperty({ example: '9780262046305' })
  @IsString()
  @IsNotEmpty()
  isbn!: string;

  @ApiProperty({ example: 1312 })
  @IsNumber()
  @IsNotEmpty()
  pages!: number;

  @ApiProperty({ example: 2009 })
  @IsNumber()
  @IsNotEmpty()
  year!: number;

  @ApiProperty({ type: [AuthorDto] })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AuthorDto)
  authors!: AuthorDto[];
}
