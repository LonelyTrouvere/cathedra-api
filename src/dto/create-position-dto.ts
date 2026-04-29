import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionDto {
  @ApiProperty({ example: 'Professor' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Professors' })
  @IsString()
  @IsNotEmpty()
  plural!: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  sortNumber!: number;
}
