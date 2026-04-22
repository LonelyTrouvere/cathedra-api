import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLecturerDto } from 'src/dto/lecturers/create-lecturer.dto';
import { UpdateLecturerDTO } from 'src/dto/lecturers/update-lecturer.dto';
import {
  Lecturer,
  LecturerDocument,
  LecturerUrl,
  ShortLecturer,
} from 'src/schemas/lecturer';
import { Position } from 'src/schemas/position';

@Injectable()
export class LecturersService {
  constructor(
    @InjectModel('Lecturer')
    private readonly lecturerModel: Model<LecturerDocument>,
  ) {}

  async getLecturers(): Promise<ShortLecturer[]> {
    const lecturers = await this.lecturerModel.find().exec();
    await this.lecturerModel.populate(lecturers, {
      path: 'position',
      select: ['name', 'plural', 'sortNumber'],
    });
    console.log('Fetched lecturers:', lecturers);
    return lecturers.map(
      (lecturer) =>
        new ShortLecturer(
          lecturer.name,
          lecturer.surname,
          new Position(
            lecturer.position.id,
            lecturer.position.name,
            lecturer.position.plural,
            lecturer.position.sortNumber,
          ),
          lecturer.slug,
          lecturer.active,
          lecturer.id,
          lecturer.photoUrl,
          lecturer.middleName,
          lecturer.titles,
          lecturer.publications,
          lecturer.courses,
          lecturer.thesisSupervisions,
          lecturer.subjects,
          lecturer.personalHistory,
          lecturer.urls,
        ),
    );
  }

  async getLecturerBySlug(slug: string): Promise<Lecturer> {
    const lecturer = await this.lecturerModel.findOne({ slug }).exec();
    await this.lecturerModel.populate(lecturer, {
      path: 'position',
      select: ['name', 'plural', 'sortNumber'],
    });

    if (!lecturer) {
      throw new HttpException('Lecturer not found', 404);
    }

    return new Lecturer(
      lecturer.name,
      lecturer.surname,
      new Position(
        lecturer.position.id,
        lecturer.position.name,
        lecturer.position.plural,
        lecturer.position.sortNumber,
      ),
      lecturer.slug,
      lecturer.active,
      lecturer.id,
      lecturer.photoUrl,
      lecturer.middleName,
      lecturer.titles,
      lecturer.publications,
      lecturer.courses,
      lecturer.thesisSupervisions,
      lecturer.subjects,
      lecturer.personalHistory,
      lecturer.urls,
    );
  }

  async addUrlToLecturer(
    lecturer: Lecturer,
    urlData: LecturerUrl[],
  ): Promise<void> {
    try {
      lecturer.urls = [...(lecturer.urls || []), ...urlData];
      await this.lecturerModel
        .updateOne({ slug: lecturer.slug }, { urls: lecturer.urls })
        .exec();
    } catch (error) {
      console.error('Error adding URL to lecturer:', error);
      throw error;
    }
  }

  async updateLecturer(id: string, data: UpdateLecturerDTO): Promise<void> {
    await this.lecturerModel.findByIdAndUpdate(id, data).exec();
  }

  async createLecturer(payload: CreateLecturerDto): Promise<void> {
    try {
      const lecturer = new this.lecturerModel({ ...payload });
      await lecturer.save();
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        throw new HttpException('Lecturer with this slug already exists', 409);
      }
      if (error instanceof Error && error.name === 'ValidationError') {
        throw new HttpException(error.toString(), 400);
      }
      console.error('Error creating lecturer:', error);
      throw error;
    }
  }
}
