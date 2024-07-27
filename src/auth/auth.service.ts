import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'


@Injectable()
export class AuthService {

  constructor( private jwt: JwtService ) {}

  async login(user: any): Promise<object> {  
    return { "accessToken": await this.jwt.signAsync({}) }
  }

  // validate user details before logging in
   async validateUser(email: string, psw: string):Promise<boolean> {
      return false
  }

 
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12)
  }

  async comparePasswords(plainPassword: string, passwordHash:string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, passwordHash)
  }
}