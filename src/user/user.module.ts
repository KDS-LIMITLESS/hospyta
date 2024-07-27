import { Module } from "@nestjs/common";
import { UserControllers } from "./controller";
import { DatabaseService } from "src/database/database.service";
import { UserService } from "./service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema";
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