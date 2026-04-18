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
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBookDto } from 'src/dto/create-book.dto';
import { BooksService } from 'src/services/books/books.service';
import { FileService } from 'src/services/file/file.service';
import { randomUUID } from 'crypto';
import { BookFiltersDto } from 'src/dto/book-filters';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  async getBooks(@Query() payload: BookFiltersDto) {
    return await this.booksService.getBooks(payload);
  }

  @Get('/total')
  async getTotalBooks(@Query() payload: BookFiltersDto) {
    const count = await this.booksService.getTotalBooks(payload);
    return { total: count };
  }

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
