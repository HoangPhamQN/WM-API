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
  avtUrl: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orginazation' }],
  })
  organization: Orginazation[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  role: Role[];

  [key: string]: any;
}

export const UserSchema = SchemaFactory.createForClass(User)
  .set('toJSON', {
    virtuals: true,
  })
  .set('timestamps', true);

UserSchema.virtual('orginazations', {
  ref: 'Orginazation', // The model to use
  localField: '_id', // Your local field, like a `FOREIGN KEY` in RDS
  foreignField: 'createdBy', // Your foreign field which `localField` linked to. Like `REFERENCES` in RDS
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
});
