import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProgramInfoDto } from 'src/dto/create-program-info.dto';
import { ProgramFiltersDto } from 'src/dto/get-program-info';
import { FileService } from 'src/services/file/file.service';
import { ProgramInfoService } from 'src/services/program-info/program-info.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateProgramInfoValidator } from 'src/dto/update-program-info.dto';
import { ProgramDegree } from 'src/schemas/program-degree';
import { ProgramDocumentType } from 'src/schemas/program-document-types';

@Controller('program-info')
export class ProgramInfoController {
  constructor(
    private readonly programInfoService: ProgramInfoService,
    private readonly fileService: FileService,
  ) {}

  @Get('degrees')
  getProgramDegrees() {
    return Object.values(ProgramDegree);
  }

  @Get('doctypes')
  getProgramDocumentTypes() {
    return Object.values(ProgramDocumentType);
  }

  @Get()
  async getBooks(@Query() payload: ProgramFiltersDto) {
    return await this.programInfoService.getProgramInfo(payload.degree);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteProgramInfo(@Param('id') id: string) {
    const programInfo = await this.programInfoService.getProgramInfoById(id);
    if (!programInfo) {
      throw new HttpException('Program info not found', 404);
    }

    if (programInfo.documentUrl) {
      try {
        await this.fileService.deleteFile(programInfo.documentUrl);
      } catch (error) {
        console.error('Error deleting program document:', error);
      }
    }

    return await this.programInfoService.deleteProgramInfo(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateProgramInfo(
    @Param('id') id: string,
    @Body() data: UpdateProgramInfoValidator,
  ) {
    await this.programInfoService.updateProgramInfo(id, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
    return await this.programInfoService.createProgramInfo(
      payload,
      `${documentUrl}/${file.filename}`,
    );
  }
}
