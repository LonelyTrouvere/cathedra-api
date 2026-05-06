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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBookDto } from 'src/dto/create-book.dto';
import { BooksService } from 'src/services/books/books.service';
import { FileService } from 'src/services/file/file.service';
import { randomUUID } from 'crypto';
import { BookFiltersDto } from 'src/dto/book-filters';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateBookValidator } from 'src/dto/update-book-dto';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly fileService: FileService,
  ) {}

  @ApiOperation({
    summary: 'Отримати список книг',
  })
  @Get()
  async getBooks(@Query() payload: BookFiltersDto) {
    return await this.booksService.getBooks(payload);
  }

  @ApiOperation({
    summary: 'Отримати кількість книг',
    description:
      'Повертає загальну кількість книг, що відповідають заданим фільтрам. Корисно для пагінації.',
  })
  @Get('/total')
  async getTotalBooks(@Query() payload: BookFiltersDto) {
    const count = await this.booksService.getTotalBooks(payload);
    return { total: count };
  }

  @ApiOperation({
    summary: 'Оновити фотографію книги',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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

    if (book.photoUrl) {
      try {
        await this.fileService.deleteFile(book.photoUrl);
      } catch (error) {
        console.error('Error deleting book photo:', error);
      }
    }

    file.filename = `${randomUUID()}.${file.mimetype.split('/')[1]}`;
    await this.fileService.createFile('uploads/books/cover', file);
    const filePath = `uploads/books/cover/${file.filename}`;
    await this.booksService.updateBook(id, { photoUrl: filePath });
  }

  @ApiOperation({
    summary: 'Оновити зміст книги',
    description: 'Дає користувачеві доступ до власне вмісту книги.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['document'],
    },
  })
  @Patch('/:id/document')
  @UseInterceptors(FileInterceptor('document'))
  async updateBookDocument(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'application/pdf' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const book = await this.booksService.getBookById(id);
    if (!book) {
      throw new HttpException('Book not found', 404);
    }

    if (book.documentUrl) {
      try {
        await this.fileService.deleteFile(book.documentUrl);
      } catch (error) {
        console.error('Error deleting book document:', error);
      }
    }

    file.filename = `${randomUUID()}.${file.mimetype.split('/')[1]}`;
    await this.fileService.createFile('uploads/books/content', file);
    const filePath = `uploads/books/content/${file.filename}`;
    await this.booksService.updateBook(id, { documentUrl: filePath });
  }

  @ApiOperation({
    summary: 'Створити нову книгу',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateBookDto })
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

  @ApiOperation({
    summary: 'Оновити книгу',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() payload: UpdateBookValidator,
  ) {
    const book = await this.booksService.getBookById(id);
    if (!book) {
      throw new HttpException('Book not found', 404);
    }

    return await this.booksService.updateBook(id, payload);
  }

  @ApiOperation({
    summary: 'Видалити книгу',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    const book = await this.booksService.getBookById(id);
    if (!book) {
      throw new HttpException('Book not found', 404);
    }

    if (book.photoUrl) {
      try {
        await this.fileService.deleteFile(book.photoUrl);
      } catch (error) {
        console.error('Error deleting book photo:', error);
      }
    }

    if (book.documentUrl) {
      try {
        await this.fileService.deleteFile(book.documentUrl);
      } catch (error) {
        console.error('Error deleting book document:', error);
      }
    }

    return await this.booksService.deleteBook(id);
  }
}
