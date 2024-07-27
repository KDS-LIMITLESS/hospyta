import { IsEmail, IsMongoId, IsNotEmpty } from "class-validator";


export class createUserDto {

  @IsNotEmpty()
  username: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string

}


export class UserResponseDto {
  @IsMongoId()
  _id
  username: string
  email: string
  created_at: Date

}