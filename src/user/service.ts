import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { User } from "./schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { createUserDto, UserResponseDto } from "./user.Dto";
import * as bcrypt from 'bcryptjs'
import { AuthService } from "src/auth/auth.service";


@Injectable()
export class UserService {

  dbService: DatabaseService<User>

  constructor(@InjectModel(User.name) private userModel: Model<User>, private authService: AuthService) {
    this.dbService = new DatabaseService<User>(this.userModel)
  }

  async createNewUser(userData: createUserDto): Promise<UserResponseDto> {
    let hashPSW = await this.authService.hashPassword(userData.password)
    userData.password = hashPSW
    let user = await this.dbService.create(userData)
    return this.toUserResponseDTO(user)
  }

  private toUserResponseDTO(user: User): UserResponseDto {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    };
  }
}
