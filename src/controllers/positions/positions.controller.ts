import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePositionDto } from 'src/dto/create-position-dto';
import { PositionsService } from 'src/services/positions/positions.service';

@Controller('positions')
export class PositionsController {
  constructor(protected readonly positionsService: PositionsService) {}

  @Post()
  async createPosition(@Body() payload: CreatePositionDto): Promise<void> {
    return await this.positionsService.createPosition(payload);
  }

  @Get()
  async getAllPositions(): Promise<object[]> {
    return await this.positionsService.getAllPositions();
  }
}
