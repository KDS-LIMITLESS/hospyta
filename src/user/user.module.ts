import { Module } from "@nestjs/common";
import { UserControllers } from "./user.controller";
import { DatabaseService } from "src/database/database.service";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { Model } from "mongoose";
import { AuthService } from "src/auth/auth.service";


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema}])],
  controllers: [UserControllers],
  providers: [
    
    UserService, 
    AuthService
  ]
})

export class UserModule {}