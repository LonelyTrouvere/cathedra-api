import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBookDto } from 'src/dto/create-book.dto';
import { BooksService } from 'src/services/books/books.service';
import { FileService } from 'src/services/file/file.service';
import { randomUUID } from 'crypto';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async createBook(
    @Body() payload: CreateBookDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpeg)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    file.filename = `${randomUUID()}.${file.mimetype.split('/')[1]}`;
    await this.fileService.createFile('uploads/books/cover', file);
    return await this.booksService.createBook(
      payload,
      `uploads/books/cover/${file.filename}`,
    );
  }
}
