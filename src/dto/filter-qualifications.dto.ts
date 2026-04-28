import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { ProgramDegree } from 'src/schemas/program-degree';

export class FilterQualificationsDto {
  @IsOptional()
  @IsEnum(ProgramDegree)
  degree?: ProgramDegree;

  @IsOptional()
  @IsNumberString()
  startYear?: number;

  @IsOptional()
  @IsNumberString()
  endYear?: number;
}
