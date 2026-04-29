import { Module } from '@nestjs/common';
import { LecturersController } from './controllers/lecturers/lecturers.controller';
import { LecturersService } from './services/lecturers/lecturers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LecturerSchema } from './schemas/lecturer';
import { FileService } from './services/file/file.service';
import { BooksService } from './services/books/books.service';
import { BooksController } from './controllers/books/books.controller';
import { BookSchema } from './schemas/book';
import { ProgramInfoService } from './services/program-info/program-info.service';
import { ProgramInfoSchema } from './schemas/program-info';
import { ProgramInfoController } from './controllers/program-info/program-info.controller';
import { QualificationsController } from './controllers/qualifications/qualifications.controller';
import { QualificationsService } from './services/qualifications/qualifications.service';
import { QualificationSchema } from './schemas/qualification';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { UserSchema } from './schemas/user';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/cathedra'),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: { expiresIn: '12h' },
    }),
    MongooseModule.forFeature([{ name: 'Lecturer', schema: LecturerSchema }]),
    MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
    MongooseModule.forFeature([
      { name: 'ProgramInfo', schema: ProgramInfoSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'Qualification', schema: QualificationSchema },
    ]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [
    LecturersController,
    BooksController,
    ProgramInfoController,
    QualificationsController,
    UsersController,
  ],
  providers: [
    LecturersService,
    FileService,
    BooksService,
    ProgramInfoService,
    QualificationsService,
    UsersService,
    JwtAuthGuard,
  ],
})
export class AppModule {}
