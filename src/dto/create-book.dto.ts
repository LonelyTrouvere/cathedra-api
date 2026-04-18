import { IsArray, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  publisher!: string;

  @IsString()
  @IsNotEmpty()
  language!: string;

  @IsString()
  @IsNotEmpty()
  isbn!: string;

  @IsNumberString()
  @IsNotEmpty()
  pages!: number;

  @IsNumberString()
  @IsNotEmpty()
  year!: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  authors!: string[];
}
