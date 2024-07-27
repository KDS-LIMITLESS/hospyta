import { Body, Controller, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { UserService } from "./service";
import { SkipAuth } from "src/auth/jwt.strategy";
import { createUserDto } from "./user.Dto";

@Controller('api.hospyta/v1/users')
export class UserControllers {
  constructor (private userService: UserService) {}

  @SkipAuth()
  @Post('create')
  async createNewUser(@Res() res, @Req() req, @Body() payload: createUserDto) {
    return res.status(HttpStatus.OK).json(await this.userService.createNewUser(payload))
  }

}