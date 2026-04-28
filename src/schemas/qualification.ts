import { HydratedDocument, Schema } from 'mongoose';
import { IdentitySchema } from './identity-schema';
import { ProgramDegree } from './program-degree';

export class Qualification extends IdentitySchema {
  constructor(
    public id: string,
    public studentName: string,
    public qualificationName: string,
    public group: string,
    public degree: ProgramDegree,
    public startYear: number,
    public endYear: number,
    public supervisor: { name?: string; lecturerId?: string },
  ) {
    super();
  }

  public formatResponse(): object {
    return {
      id: this.id,
      studentName: this.studentName,
      qualificationName: this.qualificationName,
      group: this.group,
      degree: this.degree,
      startYear: this.startYear,
      endYear: this.endYear,
      supervisor: this.supervisor,
    };
  }
}

export type QualificationDocument = HydratedDocument<Qualification>;

export const QualificationSchema = new Schema<Qualification>(
  {
    studentName: { type: String, required: true, trim: true },
    degree: {
      type: String,
      enum: Object.values(ProgramDegree),
      required: true,
      trim: true,
    },
    qualificationName: { type: String, required: true, trim: true },
    group: { type: String, required: true, trim: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number, required: true },
    supervisor: {
      type: {
        name: { type: String, required: false, trim: true },
        lecturerId: {
          type: Schema.Types.ObjectId,
          ref: 'Lecturer',
          required: false,
          trim: true,
        },
      },
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

QualificationSchema.loadClass(Qualification);
