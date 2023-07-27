import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Orginazation } from 'src/orginazation/schemas/orginazation.schema';
import { Role } from 'src/role/schemas/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  refreshToken: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orginazation' }],
  })
  organization: Orginazation;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  role: Role;

  [key: string]: any;
}

export const UserSchema = SchemaFactory.createForClass(User);
