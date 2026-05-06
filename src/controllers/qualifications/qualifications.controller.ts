import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateQualificationDto } from 'src/dto/create-qualification.dto';
import { FilterQualificationsDto } from 'src/dto/filter-qualifications.dto';
import { UpdateQualificationValidator } from 'src/dto/update-qualification.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { QualificationsService } from 'src/services/qualifications/qualifications.service';

@Controller('qualifications')
export class QualificationsController {
  constructor(
    protected readonly qualificationsService: QualificationsService,
  ) {}

  @ApiOperation({
    summary: 'Отримати роки захисту',
  })
  @Get('/years')
  async getQualificationYears(@Query() payload: FilterQualificationsDto) {
    return await this.qualificationsService.getQualificationYears(
      payload.degree,
    );
  }

  @ApiOperation({
    summary: 'Отримати список дипломних робіт',
  })
  @Get()
  async getQualifications(@Query() payload: FilterQualificationsDto) {
    return await this.qualificationsService.getQualifications(payload);
  }

  @ApiOperation({
    summary: 'Створити роботу',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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

  @ApiOperation({
    summary: 'Видалити роботу',
  })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteQualification(@Param('id') id: string) {
    return await this.qualificationsService.deleteQualification(id);
  }

  @ApiOperation({
    summary: 'Оновити роботу',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateQualification(
    @Param('id') id: string,
    @Body() data: UpdateQualificationValidator,
  ) {
    await this.qualificationsService.updateQualification(id, data);
  }
}
