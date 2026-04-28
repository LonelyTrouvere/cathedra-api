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
import { ProgramDegree } from 'src/schemas/program-degree';

class SupervisorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsMongoId()
  @IsOptional()
  lecturerId?: string;
}

export class CreateQualificationDto {
  @IsString()
  @IsNotEmpty()
  studentName!: string;

  @IsString()
  @IsNotEmpty()
  qualificationName!: string;

  @IsString()
  @IsNotEmpty()
  group!: string;

  @IsNotEmpty()
  @IsEnum(ProgramDegree)
  degree!: ProgramDegree;

  @IsNumber()
  @IsNotEmpty()
  startYear!: number;

  @IsNumber()
  @IsNotEmpty()
  endYear!: number;

  @ValidateNested()
  @Type(() => SupervisorDto)
  supervisor!: SupervisorDto;
}
