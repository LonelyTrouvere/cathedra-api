import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProgramDegree } from 'src/schemas/program-degree';

export class SupervisorDto {
  @ApiPropertyOptional({ example: 'Dr. Smith' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '66c7f9f1b2e4a7b8c9d01234' })
  @IsMongoId()
  @IsOptional()
  lecturerId?: string;
}

export class CreateQualificationDto {
  @ApiProperty({ example: 'Alice Johnson' })
  @IsString()
  @IsNotEmpty()
  studentName!: string;

  @ApiProperty({ example: 'BSc Thesis' })
  @IsString()
  @IsNotEmpty()
  qualificationName!: string;

  @ApiProperty({ example: 'CS-41' })
  @IsString()
  @IsNotEmpty()
  group!: string;

  @ApiProperty({ enum: ProgramDegree, example: ProgramDegree.BACHELOR })
  @IsNotEmpty()
  @IsEnum(ProgramDegree)
  degree!: ProgramDegree;

  @ApiProperty({ example: 2020 })
  @IsNumber()
  @IsNotEmpty()
  startYear!: number;

  @ApiProperty({ example: 2024 })
  @IsNumber()
  @IsNotEmpty()
  endYear!: number;

  @ApiProperty({ type: SupervisorDto })
  @ValidateNested()
  @Type(() => SupervisorDto)
  supervisor!: SupervisorDto;
}
