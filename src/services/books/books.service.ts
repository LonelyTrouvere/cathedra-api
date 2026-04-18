import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from 'src/dto/create-book.dto';
import { BookDocument } from 'src/schemas/book';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel('Book')
    private readonly bookModel: Model<BookDocument>,
  ) {}

  async createBook(payload: CreateBookDto, photoUrl: string): Promise<void> {
    try {
      const book = new this.bookModel({ ...payload, photoUrl });
      await book.save();
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        throw new HttpException('Book with this isbn already exists', 409);
      }
      console.error('Error creating book:', error);
      throw error;
    }
  }
}
