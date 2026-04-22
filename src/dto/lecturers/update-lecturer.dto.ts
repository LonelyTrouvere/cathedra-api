import { PartialType } from '@nestjs/mapped-types';
import { CreateLecturerDto } from './create-lecturer.dto';

export class UpdateLecturerValidator extends PartialType(CreateLecturerDto) {}
export class UpdateLecturerDTO extends UpdateLecturerValidator {
  photoUrl?: string;
}
