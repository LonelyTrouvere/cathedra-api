import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LecturersController } from './controllers/lecturers/lecturers.controller';
import { LecturersService } from './services/lecturers/lecturers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LecturerSchema } from './schemas/lecturer';
import { FileService } from './services/file/file.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/cathedra'),
    MongooseModule.forFeature([{ name: 'Lecturer', schema: LecturerSchema }]),
  ],
  controllers: [AppController, LecturersController],
  providers: [AppService, LecturersService, FileService],
})
export class AppModule {}
