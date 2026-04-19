import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { _QueryFilter, Model } from 'mongoose';
import { BookFiltersDto } from 'src/dto/book-filters';
import { CreateBookDto } from 'src/dto/create-book.dto';
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

  async getBooks(filters: BookFiltersDto): Promise<Book[]> {
    const mapCallback = (b: BookDocument) =>
      new Book(
        b.title,
        b.publisher,
        b.language,
        b.pages,
        b.isbn,
        b.authors,
        b.photoUrl,
        b.year,
      );
    const conditions = this.getFilterConditions(filters);

    const books = await this.bookModel
      .find(conditions)
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .exec();
    return books.map(mapCallback);
  }

  async getTotalBooks(filters: BookFiltersDto): Promise<number> {
    const conditions = this.getFilterConditions(filters);
    return await this.bookModel.countDocuments(conditions).exec();
  }

  async createBook(payload: CreateBookDto, photoUrl: string): Promise<void> {
    try {
      const book = new this.bookModel({ ...payload, photoUrl });
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
