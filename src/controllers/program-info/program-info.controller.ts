import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProgramInfoDto } from 'src/dto/create-program-info.dto';
import { ProgramFiltersDto } from 'src/dto/get-program-info';
import { FileService } from 'src/services/file/file.service';
import { ProgramInfoService } from 'src/services/program-info/program-info.service';

@Controller('program-info')
export class ProgramInfoController {
  constructor(
    private readonly programInfoService: ProgramInfoService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  async getBooks(@Query() payload: ProgramFiltersDto) {
    return await this.programInfoService.getProgramInfo(payload.degree);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Computer Science' },
        degree: { type: 'string', example: 'Bachelor' },
        documentType: { type: 'string', example: 'Syllabus' },
        startYear: { type: 'string', example: '2024' },
        endYear: { type: 'string', example: '2028' },
        document: { type: 'string', format: 'binary' },
      },
      required: ['name', 'degree', 'documentType', 'document'],
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('document'))
  async createProgramInfo(
    @Body() payload: CreateProgramInfoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'application/pdf' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const uuid = crypto.randomUUID();
    file.filename = `${payload.name.replace(/\s+/g, '_')}_${payload.degree}_${uuid}.${file.mimetype.split('/')[1]}`;
    const documentUrl = `uploads/program/documents`;
    await this.fileService.createFile(documentUrl, file);
    await this.programInfoService.createProgramInfo(
      payload,
      `${documentUrl}/${file.filename}`,
    );
  }
}
