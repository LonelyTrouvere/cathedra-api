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
import { PositionSchema } from './schemas/position';
import { PositionsService } from './services/positions/positions.service';
import { PositionsController } from './controllers/positions/positions.controller';
import { ProgramInfoService } from './services/program-info/program-info.service';
import { ProgramInfoSchema } from './schemas/program-info';
import { ProgramInfoController } from './controllers/program-info/program-info.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/cathedra'),
    MongooseModule.forFeature([{ name: 'Lecturer', schema: LecturerSchema }]),
    MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
    MongooseModule.forFeature([{ name: 'Position', schema: PositionSchema }]),
    MongooseModule.forFeature([
      { name: 'ProgramInfo', schema: ProgramInfoSchema },
    ]),
  ],
  controllers: [
    AppController,
    LecturersController,
    BooksController,
    PositionsController,
    ProgramInfoController,
  ],
  providers: [
    AppService,
    LecturersService,
    FileService,
    BooksService,
    PositionsService,
    ProgramInfoService,
  ],
})
export class AppModule {}
