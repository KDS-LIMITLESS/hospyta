import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type userDocument = HydratedDocument<User>

@Schema()
export class User {

  @Prop({ required: true })
  username: string;

  @Prop( { required: true } )
  email: string

  @Prop( { required: true } )
  password: string

  @Prop()
  image: string

  @Prop()
  created_at: Date

}

export const UserSchema = SchemaFactory.createForClass(User);