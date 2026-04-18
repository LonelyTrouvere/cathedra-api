import { HydratedDocument, Schema } from 'mongoose';
import { IdentitySchema } from './identity-schema';

export class Book extends IdentitySchema {
  constructor(
    public title: string,
    public publisher: string,
    public language: string,
    public pages: number,
    public isbn: string,
    public authors: string[],
    public photoUrl: string,
    public year: number,
  ) {
    super();
  }

  public formatResponse(): object {
    return {
      title: this.title,
      publisher: this.publisher,
      language: this.language,
      pages: this.pages,
      isbn: this.isbn,
      authors: this.authors,
      photoUrl: this.photoUrl,
      year: this.year,
    };
  }
}

export type BookDocument = HydratedDocument<Book>;

export const BookSchema = new Schema<Book>(
  {
    title: { type: String, required: true, trim: true },
    publisher: { type: String, required: true, trim: true },
    language: { type: String, required: true, trim: true },
    pages: { type: Number, required: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    authors: { type: [String], required: true, trim: true },
    photoUrl: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
  },
  {
    versionKey: false,
  },
);

BookSchema.loadClass(Book);
