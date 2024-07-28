import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument, ObjectId } from 'mongoose'

export type userDocument = HydratedDocument<User>

@Schema({timestamps: true})
export class User {

  _id: ObjectId

  @Prop({ required: true })
  username: string;

  @Prop( { required: true } )
  email: string

  @Prop( { required: true } )
  password: string

  @Prop()
  user_image: string

  @Prop()
  createdAt: Date

}
export const UserSchema = SchemaFactory.createForClass(User);
const userimageAvatars = [
  'https://github.githubassets.com/assets/yolo-default-be0bbff04951.png',
  'https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png',
  'https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png',
  'https://robohash.org/1.png',
  'https://robohash.org/2.png',
]

UserSchema.pre<User>('save', async function(next) {

  if (!this.user_image) {
    const randomIndex = Math.floor(Math.random() * userimageAvatars.length)
    this.user_image = userimageAvatars[randomIndex]
  }

  next();
});

