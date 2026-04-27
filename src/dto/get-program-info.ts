import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProgramDegree } from 'src/schemas/program-degree';

export class ProgramFiltersDto {
  @IsNotEmpty()
  @IsEnum(ProgramDegree)
  degree!: ProgramDegree;
}
