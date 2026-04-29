import { PartialType } from '@nestjs/mapped-types';
import { CreateProgramInfoDto } from './create-program-info.dto';

export class UpdateProgramInfoValidator extends PartialType(
  CreateProgramInfoDto,
) {}
