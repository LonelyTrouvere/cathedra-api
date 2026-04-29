import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProgramInfoDto } from 'src/dto/create-program-info.dto';
import { UpdateProgramInfoValidator } from 'src/dto/update-program-info.dto';
import { ProgramDegree } from 'src/schemas/program-degree';
import { ProgramInfo, ProgramInfoDocument } from 'src/schemas/program-info';

@Injectable()
export class ProgramInfoService {
  constructor(
    @InjectModel('ProgramInfo')
    private readonly programInfoModel: Model<ProgramInfoDocument>,
  ) {}

  async getProgramInfoById(id: string) {
    return await this.programInfoModel.findById(id).exec();
  }

  async getProgramInfo(degree: ProgramDegree) {
    const programs = await this.programInfoModel.find({ degree }).exec();
    return programs.map(
      (program) =>
        new ProgramInfo(
          program.id,
          program.name,
          program.degree,
          program.documentUrl,
          program.documentType,
          program.startYear,
          program.endYear,
        ),
    );
  }

  async createProgramInfo(
    programInfo: CreateProgramInfoDto,
    documentUrl: string,
  ) {
    const createdProgramInfo = new this.programInfoModel({
      ...programInfo,
      documentUrl,
    });
    return await createdProgramInfo.save();
  }

  async deleteProgramInfo(id: string): Promise<void> {
    await this.programInfoModel.findByIdAndDelete(id).exec();
  }

  async updateProgramInfo(
    id: string,
    data: UpdateProgramInfoValidator,
  ): Promise<void> {
    await this.programInfoModel.findByIdAndUpdate(id, data).exec();
  }
}
