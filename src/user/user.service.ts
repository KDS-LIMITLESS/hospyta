import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { User } from "./user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { createUserDto, UserResponseDto } from "./user.Dto";
import * as bcrypt from 'bcryptjs'
import { AuthService } from "src/auth/auth.service";
import ResponseMessages from "src/utils/response-messages";


@Injectable()
export class UserService {

  dbService: DatabaseService<User>

  constructor(@InjectModel(User.name) private userModel: Model<User>, private authService: AuthService) {
    this.dbService = new DatabaseService<User>(this.userModel)
  }

  async createNewUser(userData: createUserDto): Promise<UserResponseDto> {
    try {
      let find_user = await this.userModel.find({email: userData.email})

      if (find_user.length !== 0) {
        throw new BadGatewayException({message: ResponseMessages.UserAlreadyExists})
      }
      // CONVERT USER'S PLAIN PASSWORD TO A HASH
      let hashPSW = await this.authService.hashPassword(userData.password)
      userData.password = hashPSW

      let user = await this.dbService.create(userData)
      return this.toUserResponseDTO(user)
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    }
  }

  private toUserResponseDTO(user: User): UserResponseDto {
    try {
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        created_at: user.createdAt,
      };
    }
    catch(err: any) {
      throw new BadRequestException({message: err.message})
    } 
  }
}
