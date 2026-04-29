import { HydratedDocument, Schema } from 'mongoose';

export class User {
  username!: string;
  password!: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);
