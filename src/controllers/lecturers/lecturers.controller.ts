import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { type Express } from 'express';
import { CreateLecturerDto } from 'src/dto/lecturers/create-lecturer.dto';
import { LecturersFiltersDto } from 'src/dto/lecturers/lecturers-filters.dto';
import { type LecturerUrl } from 'src/schemas/lecturer';
import { FileService } from 'src/services/file/file.service';
import { LecturersService } from 'src/services/lecturers/lecturers.service';

@Controller('lecturers')
export class LecturersController {
  constructor(
    private readonly lecturersService: LecturersService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  async getLecturers(@Query() payload: LecturersFiltersDto) {
    return await this.lecturersService.getLecturers(payload);
  }

  @Get(':slug')
  async getLecturerBySlug(@Param('slug') slug: string) {
    return await this.lecturersService.getLecturerBySlug(slug);
  }

  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Personal website' },
          url: { type: 'string', example: 'https://example.com' },
        },
        required: ['name', 'url'],
      },
      example: [
        { name: 'Personal website', url: 'https://example.com' },
        { name: 'Google Scholar', url: 'https://scholar.google.com' },
      ],
    },
  })
  @Put(':slug/url')
  async addUrlToLecturer(
    @Param('slug') slug: string,
    @Body() urlData: LecturerUrl[],
  ) {
    const lecturer = await this.lecturersService.getLecturerBySlug(slug);
    await this.lecturersService.addUrlToLecturer(lecturer, urlData);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['photo'],
    },
  })
  @Patch(':slug/photo')
  @UseInterceptors(FileInterceptor('photo'))
  async updateLecturerPhoto(
    @Param('slug') slug: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpeg)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const lecturer = await this.lecturersService.getLecturerBySlug(slug);
    if (!lecturer) {
      throw new HttpException('Lecturer not found', 404);
    }

    file.filename = `${randomUUID()}.${file.mimetype.split('/')[1]}`;
    await this.fileService.createFile('uploads/lecturers', file);
    const filePath = `uploads/lecturers/${file.filename}`;
    await this.lecturersService.updateLecturer(lecturer.id, {
      photoUrl: filePath,
    });
  }

  @Post()
  async createLecturer(@Body() payload: CreateLecturerDto) {
    return await this.lecturersService.createLecturer(payload);
  }
}
