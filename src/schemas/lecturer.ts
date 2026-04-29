import { HydratedDocument, Schema } from 'mongoose';
import { IdentitySchema } from './identity-schema';
import { Positions } from './positions';

export interface LecturerUrl {
  name: string;
  url: string;
}

export class Lecturer extends IdentitySchema {
  constructor(
    public name: string,
    public surname: string,
    public position: Positions,
    public slug: string,
    public active: boolean,
    public id: string,
    public photoUrl?: string,
    public middleName?: string,
    public titles?: string[],
    public publications?: string[],
    public courses?: string[],
    public thesisSupervisions?: string[],
    public subjects?: string[],
    public personalHistory?: string[],
    public urls?: LecturerUrl[],
  ) {
    super();
  }

  public formatResponse(): object {
    return {
      name: this.name,
      surname: this.surname,
      position: this.position,
      titles: this.titles,
      active: this.active,
      id: this.id,
      publications: this.publications,
      courses: this.courses,
      thesisSupervisions: this.thesisSupervisions,
      subjects: this.subjects,
      slug: this.slug,
      photoUrl: this.photoUrl,
      middleName: this.middleName,
      personalHistory: this.personalHistory,
      urls: this.urls,
    };
  }
}

export class ShortLecturer extends Lecturer {
  public formatResponse(): object {
    return {
      name: this.name,
      surname: this.surname,
      id: this.id,
      middleName: this.middleName,
      position: this.position,
      titles: this.titles,
      slug: this.slug,
      active: this.active,
      photoUrl: this.photoUrl,
    };
  }
}

export type LecturerDocument = HydratedDocument<Lecturer>;

export const LecturerSchema = new Schema<Lecturer>(
  {
    name: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    surname: { type: String, required: true, trim: true },
    position: {
      type: String,
      enum: Object.values(Positions),
      required: true,
    },
    titles: { type: [String], trim: true },
    publications: { type: [String], trim: true },
    courses: { type: [String], trim: true },
    thesisSupervisions: { type: [String], trim: true },
    subjects: { type: [String], trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    photoUrl: { type: String, trim: true },
    active: { type: Boolean, default: true, required: true },
    personalHistory: { type: [String], trim: true },
    urls: [
      {
        name: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
      },
    ],
  },
  {
    versionKey: false,
  },
);

LecturerSchema.loadClass(Lecturer);
