import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "@prisma/client";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("registration")
  registration(@Body() user: User) {
    console.log(user);
    return this.authService.registration(user);
  }

  @Post("login")
  login(@Body() user: LoginUserDto) {
    return this.authService.login(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post("logout")
  logout(@Req() request) {
    const accessToken = request.headers.authorization.split(" ")[1];
    return this.authService.logout(accessToken);
  }

  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  refresh(@Req() request, @Body() body) {
    return this.authService.refresh(body.data);
  }
}
