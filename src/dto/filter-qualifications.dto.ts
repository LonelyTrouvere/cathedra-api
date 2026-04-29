import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProgramDegree } from 'src/schemas/program-degree';

export class FilterQualificationsDto {
  @ApiPropertyOptional({ enum: ProgramDegree, example: ProgramDegree.BACHELOR })
  @IsOptional()
  @IsEnum(ProgramDegree)
  degree?: ProgramDegree;

  @ApiPropertyOptional({ example: 2020, type: Number })
  @IsOptional()
  @IsNumberString()
  startYear?: number;

  @ApiPropertyOptional({ example: 2024, type: Number })
  @IsOptional()
  @IsNumberString()
  endYear?: number;
}
