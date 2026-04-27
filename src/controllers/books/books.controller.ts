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

  @Patch('/:id/photo')
  @UseInterceptors(FileInterceptor('photo'))
  async updateBookPhoto(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpeg)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const book = await this.booksService.getBookById(id);
    if (!book) {
      throw new HttpException('Book not found', 404);
    }

    file.filename = `${randomUUID()}.${file.mimetype.split('/')[1]}`;
    await this.fileService.createFile('uploads/books/cover', file);
    const filePath = `uploads/books/cover/${file.filename}`;
    await this.booksService.updateBook(id, { photoUrl: filePath });
  }

  @Post()
  async createBook(@Body() payload: CreateBookDto) {
    for (const author of payload.authors) {
      if (author.lecturerId && author.name) {
        author.lecturerId = author.lecturerId.trim();
        throw new HttpException(
          'Each author must have either a name or a lecturer ID, but not both.',
          400,
        );
      }

      if (!author.lecturerId && !author.name) {
        throw new HttpException(
          'Each author must have either a name or a lecturer ID.',
          400,
        );
      }
    }

    return await this.booksService.createBook(payload);
  }
}
