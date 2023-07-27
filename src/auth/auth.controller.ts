import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { TokenService } from './token/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  @Post('registration')
  registration(@Body() user: User) {
    return this.authService.registration(user);
  }

  @Post('login')
  login(@Body() user: LoginUserDto) {
    return this.authService.login(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Body() { token }) {
    return this.authService.logout(token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Req() request, @Body() body) {
    return this.authService.refresh(body.data);
  }

  @Post('/resetPassword')
  async sendResetPasswordEmail(@Body() forgotPasswordDto: any) {
    const { email } = forgotPasswordDto;

    // Example:
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw Error('Incorrect email');
    }
    if (user) {
      const resetPasswordToken =
        await this.tokenService.generateResetActionToken(email); // Implement your token generation logic

      this.authService.sendResetPasswordEmail(user.email, resetPasswordToken); // Implement your email sending logic
    }
    // Return a success response
    return { message: 'Reset password email sent successfully' };
  }

  @Post('/createNewPassword')
  async resetPassword(@Body() data: any) {
    const { token, password } = data;
    return this.authService.updatePassword(token, password);
  }
}
