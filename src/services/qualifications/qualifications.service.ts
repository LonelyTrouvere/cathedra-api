import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQualificationDto } from 'src/dto/create-qualification.dto';
import { FilterQualificationsDto } from 'src/dto/filter-qualifications.dto';
import { ProgramDegree } from 'src/schemas/program-degree';
import {
  Qualification,
  QualificationDocument,
} from 'src/schemas/qualification';

@Injectable()
export class QualificationsService {
  constructor(
    @InjectModel('Qualification')
    private readonly qualificationModel: Model<QualificationDocument>,
  ) {}

  async createQualification(qualification: CreateQualificationDto) {
    const createdQualification = new this.qualificationModel({
      ...qualification,
    });
    return await createdQualification.save();
  }

  async getQualifications(filters?: FilterQualificationsDto) {
    const conditions = {};
    if (filters?.degree) {
      conditions['degree'] = filters.degree;
    }
    if (filters?.startYear) {
      conditions['startYear'] = filters.startYear;
    }
    if (filters?.endYear) {
      conditions['endYear'] = filters.endYear;
    }
    const quals = await this.qualificationModel
      .find(conditions)
      .sort({ studentName: 1 })
      .exec();

    for (const qual of quals) {
      if (qual.supervisor.lecturerId && !qual.supervisor.name) {
        await this.qualificationModel.populate(qual.supervisor, {
          path: 'lecturerId',
          select: ['name', 'surname', 'middleName', 'slug'],
        });
      }
    }

    return quals.map(
      (q) =>
        new Qualification(
          q.id,
          q.studentName,
          q.qualificationName,
          q.group,
          q.degree,
          q.startYear,
          q.endYear,
          q.supervisor,
        ),
    );
  }

  async getQualificationYears(degree?: ProgramDegree) {
    return await this.qualificationModel.aggregate([
      {
        $match: {
          degree: degree,
        },
      },
      {
        $group: {
          _id: {
            startYear: '$startYear',
            endYear: '$endYear',
          },
        },
      },
      {
        $sort: {
          '_id.startYear': 1,
          '_id.endYear': 1,
        },
      },
      {
        $project: {
          _id: 0,
          startYear: '$_id.startYear',
          endYear: '$_id.endYear',
        },
      },
    ]);
  }
}
