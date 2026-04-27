import { HydratedDocument, Schema } from 'mongoose';
import { IdentitySchema } from './identity-schema';
import { ProgramDegree } from './program-degree';
import { ProgramDocumentType } from './program-document-types';

export class ProgramInfo extends IdentitySchema {
  constructor(
    public id: string,
    public name: string,
    public degree: ProgramDegree,
    public documentUrl: string,
    public documentType: ProgramDocumentType,
    public startYear?: string,
    public endYear?: string,
  ) {
    super();
  }

  public formatResponse(): object {
    return {
      id: this.id,
      name: this.name,
      degree: this.degree,
      documentUrl: this.documentUrl,
      documentType: this.documentType,
      startYear: this.startYear,
      endYear: this.endYear,
    };
  }
}

export type ProgramInfoDocument = HydratedDocument<ProgramInfo>;

export const ProgramInfoSchema = new Schema<ProgramInfo>(
  {
    name: { type: String, required: true, trim: true },
    degree: {
      type: String,
      enum: Object.values(ProgramDegree),
      required: true,
      trim: true,
    },
    documentUrl: { type: String, required: true, trim: true },
    documentType: {
      type: String,
      enum: Object.values(ProgramDocumentType),
      required: true,
      trim: true,
    },
    startYear: { type: String, required: false, trim: true },
    endYear: { type: String, required: false, trim: true },
  },
  {
    versionKey: false,
  },
);

ProgramInfoSchema.loadClass(ProgramInfo);
