import { PartialType } from '@nestjs/mapped-types';
import { CreateQualificationDto } from './create-qualification.dto';

export class UpdateQualificationValidator extends PartialType(
  CreateQualificationDto,
) {}
