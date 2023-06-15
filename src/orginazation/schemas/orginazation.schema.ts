import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrginazationDocument = HydratedDocument<Orginazation>;

@Schema()
export class Orginazation {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  description: string;
}

export const OrginazationSchema = SchemaFactory.createForClass(Orginazation);
