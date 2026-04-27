import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProgramDegree } from 'src/schemas/program-degree';
import { ProgramDocumentType } from 'src/schemas/program-document-types';

export class CreateProgramInfoDto {
  @IsNotEmpty()
  @IsEnum(ProgramDegree)
  degree!: ProgramDegree;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEnum(ProgramDocumentType)
  documentType!: string;

  @IsOptional()
  @IsString()
  startYear?: string;

  @IsOptional()
  @IsString()
  endYear?: string;
}
