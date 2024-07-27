import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from 'bcryptjs'
import { Model } from "mongoose";
import { DatabaseService } from "src/database/database.service";
import { User } from "src/user/schema";
import { UserResponseDto } from "src/user/user.Dto";
import ResponseMessages from "src/utils/response-messages";


@Injectable()
export class AuthService {

  dbService: DatabaseService<User>
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwt: JwtService ) {
    this.dbService = new DatabaseService<User>(this.userModel)

  }

  async login(user): Promise<object> {  
    user = user._doc
    const PAYLOAD = {
      userId: user._id, 
      username: user.username, 
      email: user.email, 
      created_at: user.created_at
    }
    return { "accessToken": await this.jwt.signAsync(PAYLOAD) }
  }

  // VALIDATE USER DETAILS BEFORE LOGGING IN.
   async validateUser(user_email: string, psw: string) {
    const USER_EXIST = await this.dbService.findOneDocument("email", user_email)

    //  CHECK IF USER EXISTS AND IF USER PASSWORD MATCHES WITH ONE IN DB
    if ( USER_EXIST === null || !await this.comparePasswords(psw, USER_EXIST.password )){
      throw new UnauthorizedException({
        statusCode: 401,
        message: ResponseMessages.BadLoginDetails
      })
    }
    const {password, ...userDetails} = USER_EXIST
    return userDetails
  }

 
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12)
  }

  async comparePasswords(plainPassword: string, passwordHash:string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, passwordHash)
  }
}