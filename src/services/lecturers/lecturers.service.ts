import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLecturerDto } from 'src/dto/lecturers/create-lecturer.dto';
import {
  Lecturer,
  LecturerDocument,
  ShortLecturer,
} from 'src/schemas/lecturer';

@Injectable()
export class LecturersService {
  constructor(
    @InjectModel('Lecturer')
    private readonly lecturerModel: Model<LecturerDocument>,
  ) {}

  async getLecturers(): Promise<ShortLecturer[]> {
    const lecturers = await this.lecturerModel.find().exec();
    return lecturers.map(
      (lecturer) =>
        new ShortLecturer(
          lecturer.name,
          lecturer.surname,
          lecturer.position,
          lecturer.slug,
          lecturer.photoUrl,
          lecturer.middleName,
          lecturer.titles,
          lecturer.publications,
          lecturer.courses,
          lecturer.thesisSupervisions,
          lecturer.subjects,
        ),
    );
  }

  async getLecturerBySlug(slug: string): Promise<Lecturer> {
    const lecturer = await this.lecturerModel.findOne({ slug }).exec();
    if (!lecturer) {
      throw new HttpException('Lecturer not found', 404);
    }

    return new Lecturer(
      lecturer.name,
      lecturer.surname,
      lecturer.position,
      lecturer.slug,
      lecturer.photoUrl,
      lecturer.middleName,
      lecturer.titles,
      lecturer.publications,
      lecturer.courses,
      lecturer.thesisSupervisions,
      lecturer.subjects,
    );
  }

  async createLecturer(
    payload: CreateLecturerDto,
    photoUrl: string,
  ): Promise<void> {
    try {
      const lecturer = new this.lecturerModel({ ...payload, photoUrl });
      await lecturer.save();
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        throw new HttpException('Lecturer with this slug already exists', 409);
      }
      console.error('Error creating lecturer:', error);
      throw error;
    }
  }
}
