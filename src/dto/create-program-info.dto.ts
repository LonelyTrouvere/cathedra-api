import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProgramDegree } from 'src/schemas/program-degree';
import { ProgramDocumentType } from 'src/schemas/program-document-types';

export class CreateProgramInfoDto {
  @ApiProperty({ enum: ProgramDegree, example: ProgramDegree.BACHELOR })
  @IsNotEmpty()
  @IsEnum(ProgramDegree)
  degree!: ProgramDegree;

  @ApiProperty({ example: 'Computer Science' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    enum: ProgramDocumentType,
    example: ProgramDocumentType.SYLLABUS,
  })
  @IsNotEmpty()
  @IsEnum(ProgramDocumentType)
  documentType!: string;

  @ApiPropertyOptional({ example: '2024' })
  @IsOptional()
  @IsString()
  startYear?: string;

  @ApiPropertyOptional({ example: '2028' })
  @IsOptional()
  @IsString()
  endYear?: string;
}
