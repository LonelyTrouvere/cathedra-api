import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookValidator extends PartialType(CreateBookDto) {}
export class UpdateBookDTO extends UpdateBookValidator {
  photoUrl?: string;
}
