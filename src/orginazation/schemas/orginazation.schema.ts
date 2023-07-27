import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type OrginazationDocument = HydratedDocument<Orginazation>;

@Schema()
export class Orginazation {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  description: string;

  @Prop()
  avtUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop()
  isDeleted: boolean;

  _id: mongoose.Schema.Types.ObjectId;
}

export const OrginazationSchema = SchemaFactory.createForClass(
  Orginazation,
).set('timestamps', true);
