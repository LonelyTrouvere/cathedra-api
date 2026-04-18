import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { type Express } from 'express';
import { CreateLecturerDto } from 'src/dto/lecturers/create-lecturer.dto';
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
  async getLecturers() {
    return await this.lecturersService.getLecturers();
  }

  @Get(':slug')
  async getLecturerBySlug(@Param('slug') slug: string) {
    return await this.lecturersService.getLecturerBySlug(slug);
  }

  @Put('url/:slug')
  async addUrlToLecturer(
    @Param('slug') slug: string,
    @Body() urlData: LecturerUrl[],
  ) {
    const lecturer = await this.lecturersService.getLecturerBySlug(slug);
    await this.lecturersService.addUrlToLecturer(lecturer, urlData);
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async createLecturer(
    @Body() payload: CreateLecturerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpeg)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    file.filename = `${payload.slug}.${file.mimetype.split('/')[1]}`;
    await this.fileService.createFile('uploads/lecturers', file);
    return await this.lecturersService.createLecturer(
      payload,
      `uploads/lecturers/${file.filename}`,
    );
  }
}
