import { HydratedDocument, Schema } from 'mongoose';
import { IdentitySchema } from './identity-schema';

export class Lecturer extends IdentitySchema {
  constructor(
    public name: string,
    public surname: string,
    public position: string,
    public slug: string,
    public photoUrl: string,
    public middleName?: string,
    public titles?: string[],
    public publications?: string[],
    public courses?: string[],
    public thesisSupervisions?: string[],
    public subjects?: string[],
  ) {
    super();
  }

  public formatResponse(): object {
    return {
      name: this.name,
      surname: this.surname,
      position: this.position,
      titles: this.titles,
      publications: this.publications,
      courses: this.courses,
      thesisSupervisions: this.thesisSupervisions,
      subjects: this.subjects,
      slug: this.slug,
    };
  }
}

export class ShortLecturer extends Lecturer {
  public formatResponse(): object {
    return {
      name: this.name,
      surname: this.surname,
      middleName: this.middleName,
      position: this.position,
      titles: this.titles,
      slug: this.slug,
    };
  }
}

export type LecturerDocument = HydratedDocument<Lecturer>;

export const LecturerSchema = new Schema<Lecturer>(
  {
    name: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    surname: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    titles: { type: [String], trim: true },
    publications: { type: [String], trim: true },
    courses: { type: [String], trim: true },
    thesisSupervisions: { type: [String], trim: true },
    subjects: { type: [String], trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    photoUrl: { type: String, required: true, trim: true },
  },
  {
    versionKey: false,
  },
);

LecturerSchema.loadClass(Lecturer);
