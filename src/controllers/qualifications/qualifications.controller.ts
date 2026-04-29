import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateQualificationDto } from 'src/dto/create-qualification.dto';
import { FilterQualificationsDto } from 'src/dto/filter-qualifications.dto';
import { QualificationsService } from 'src/services/qualifications/qualifications.service';

@Controller('qualifications')
export class QualificationsController {
  constructor(
    protected readonly qualificationsService: QualificationsService,
  ) {}

  @Get('/years')
  async getQualificationYears(@Query() payload: FilterQualificationsDto) {
    return await this.qualificationsService.getQualificationYears(
      payload.degree,
    );
  }

  @Get()
  async getQualifications(@Query() payload: FilterQualificationsDto) {
    return await this.qualificationsService.getQualifications(payload);
  }

  @ApiBody({ type: CreateQualificationDto })
  @Post()
  async createQualification(@Body() payload: CreateQualificationDto) {
    if (payload.supervisor.name && payload.supervisor.lecturerId) {
      payload.supervisor.lecturerId = payload.supervisor.lecturerId.trim();
      throw new HttpException(
        'Supervisor must have either a name or a lecturer ID, but not both.',
        400,
      );
    }

    if (!payload.supervisor.lecturerId && !payload.supervisor.name) {
      throw new HttpException(
        'Supervisor must have either a name or a lecturer ID.',
        400,
      );
    }

    await this.qualificationsService.createQualification(payload);
  }
}
