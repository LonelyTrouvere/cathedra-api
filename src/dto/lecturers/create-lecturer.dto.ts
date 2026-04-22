import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLecturerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  surname!: string;

  @IsBoolean()
  @IsNotEmpty()
  active!: boolean;

  @IsString()
  @IsNotEmpty()
  position!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  titles?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  publications?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  courses?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  thesisSupervisions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  personalHistory?: string[];
}
