import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LecturersController } from './controllers/lecturers/lecturers.controller';
import { LecturersService } from './services/lecturers/lecturers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LecturerSchema } from './schemas/lecturer';
import { FileService } from './services/file/file.service';
import { BooksService } from './services/books/books.service';
import { BooksController } from './controllers/books/books.controller';
import { BookSchema } from './schemas/book';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/cathedra'),
    MongooseModule.forFeature([{ name: 'Lecturer', schema: LecturerSchema }]),
    MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
  ],
  controllers: [AppController, LecturersController, BooksController],
  providers: [AppService, LecturersService, FileService, BooksService],
})
export class AppModule {}
