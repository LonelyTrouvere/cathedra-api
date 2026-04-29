import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProgramDegree } from 'src/schemas/program-degree';

export class ProgramFiltersDto {
  @ApiProperty({ enum: ProgramDegree, example: ProgramDegree.BACHELOR })
  @IsNotEmpty()
  @IsEnum(ProgramDegree)
  degree!: ProgramDegree;
}
