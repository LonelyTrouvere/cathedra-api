import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePositionDto } from 'src/dto/create-position-dto';
import { Position, PositionDocument } from 'src/schemas/position';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel('Position')
    private readonly positionModel: Model<PositionDocument>,
  ) {}

  async getAllPositions(): Promise<Position[]> {
    const positions = await this.positionModel
      .find()
      .sort({ sortNumber: 1 })
      .exec();
    return positions.map(
      (position) =>
        new Position(
          position.id,
          position.name,
          position.plural,
          position.sortNumber,
        ),
    );
  }

  async createPosition(payload: CreatePositionDto): Promise<void> {
    try {
      const position = new this.positionModel({ ...payload });
      await position.save();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ValidationError') {
        throw new HttpException(error.toString(), 400);
      }
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        throw new HttpException('Position with this name already exists', 409);
      }
      throw error;
    }
  }
}
