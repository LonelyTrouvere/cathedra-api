import { Module } from '@nestjs/common';
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
import { QualificationsController } from './controllers/qualifications/qualifications.controller';
import { QualificationsService } from './services/qualifications/qualifications.service';
import { QualificationSchema } from './schemas/qualification';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/cathedra'),
    MongooseModule.forFeature([{ name: 'Lecturer', schema: LecturerSchema }]),
    MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
    MongooseModule.forFeature([{ name: 'Position', schema: PositionSchema }]),
    MongooseModule.forFeature([
      { name: 'ProgramInfo', schema: ProgramInfoSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'Qualification', schema: QualificationSchema },
    ]),
  ],
  controllers: [
    LecturersController,
    BooksController,
    PositionsController,
    ProgramInfoController,
    QualificationsController,
  ],
  providers: [
    LecturersService,
    FileService,
    BooksService,
    PositionsService,
    ProgramInfoService,
    QualificationsService,
  ],
})
export class AppModule {}
