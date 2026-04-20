import { HydratedDocument, Schema } from 'mongoose';
import { IdentitySchema } from './identity-schema';

export class Position extends IdentitySchema {
  constructor(
    public name: string,
    public plural: string,
    public sortNumber: number,
  ) {
    super();
  }

  public formatResponse(): object {
    return {
      name: this.name,
      plural: this.plural,
      sortNumber: this.sortNumber,
    };
  }
}

export type PositionDocument = HydratedDocument<Position>;

export const PositionSchema = new Schema<Position>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    plural: { type: String, required: true, trim: true, unique: true },
    sortNumber: {
      type: Number,
      required: true,
      validate: [
        {
          validator: (value: number) => Number.isInteger(value),
          message: 'Value is not an integer',
        },
        {
          validator: (value: number) => value > 0,
          message: 'Value must be a positive integer',
        },
      ],
    },
  },
  {
    versionKey: false,
  },
);

PositionSchema.loadClass(Position);
