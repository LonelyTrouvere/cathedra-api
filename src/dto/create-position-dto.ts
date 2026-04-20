import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  plural!: string;

  @IsNumber()
  @IsNotEmpty()
  sortNumber!: number;
}
