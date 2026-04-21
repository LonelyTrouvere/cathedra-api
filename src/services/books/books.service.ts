import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { _QueryFilter, Model } from 'mongoose';
import { BookFiltersDto } from 'src/dto/book-filters';
import { CreateBookDto } from 'src/dto/create-book.dto';
import { UpdateBookDTO } from 'src/dto/update-book-dto';
import { Book, BookDocument } from 'src/schemas/book';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel('Book')
    private readonly bookModel: Model<BookDocument>,
  ) {}

  private getFilterConditions(filters: BookFiltersDto): _QueryFilter<Book> {
    const conditions: _QueryFilter<Book> = {};

    if (filters?.isbn) {
      conditions.isbn = filters.isbn;
    }

    if (filters?.title) {
      conditions.title = { $regex: filters.title, $options: 'i' };
    }

    return conditions;
  }

  async getBookById(id: string): Promise<Book | null> {
    const book = await this.bookModel.findById(id).exec();
    return book;
  }

  async getBooks(filters: BookFiltersDto): Promise<Book[]> {
    const mapCallback = (b: BookDocument) =>
      new Book(
        b.title,
        b.publisher,
        b.language,
        b.pages,
        b.isbn,
        b.authors,
        b.year,
        b.photoUrl,
      );
    const conditions = this.getFilterConditions(filters);

    const books = await this.bookModel
      .find(conditions as any)
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .exec();
    for (const book of books) {
      for (const author of book.authors) {
        if (author.lecturerId && !author.name) {
          await this.bookModel.populate(author, {
            path: 'lecturerId',
            select: ['name', 'surname', 'middleName', 'slug'],
          });
        }
      }
    }

    return books.map(mapCallback);
  }

  async getTotalBooks(filters: BookFiltersDto): Promise<number> {
    const conditions = this.getFilterConditions(filters);
    return await this.bookModel.countDocuments(conditions as any).exec();
  }

  async updateBook(id: string, data: UpdateBookDTO): Promise<void> {
    console.log(id, data);
    await this.bookModel.findByIdAndUpdate(id, data).exec();
  }

  async createBook(payload: CreateBookDto): Promise<void> {
    try {
      const book = new this.bookModel({ ...payload, photoUrl: null });
      await book.save();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ValidationError') {
        throw new HttpException(error.toString(), 400);
      }
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        throw new HttpException('Book with this isbn already exists', 409);
      }
      throw error;
    }
  }
}
