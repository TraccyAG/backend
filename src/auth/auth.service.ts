import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token/token.service';
import { LoginUserDto } from './dto/login-user.dto';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  //registration user
  async registration(data: CreateUserDto) {
    try {
      const user = await this.userService.getUserByEmail(data.email);

      if (user) {
        return new HttpException(
          'user is already exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashPassword = await bcrypt.hash(data.password, 10);
      const savedUser = await this.userService.createUser({
        ...data,
        password: hashPassword,
      });

      return this.tokenService.generateToken(savedUser);
    } catch (e) {
      console.log(e.message);
      return e.message[0];
    }
  }

  //login User
  async login(data: LoginUserDto) {
    try {
      const userFromDb = await this._validate(data);
      if (!userFromDb) {
        throw new UnauthorizedException(
          HttpStatus.UNAUTHORIZED,
          'wrong email or password',
        );
      }

      if (userFromDb) {
        const tokenPairFromDb = await this.tokenService.getTokenPairByUserId(
          userFromDb.id,
        );
        if (tokenPairFromDb) {
          await this.tokenService.deleteTokenPair(userFromDb.id);
        }
        return this.tokenService.generateToken(userFromDb);
      }
    } catch (e) {
      throw new HttpException(e.message, 404);
    }
  }

  //logout
  async logout(accessToken: string) {
    try {
      const tokenPayload = await this.tokenService.verifyToken(
        accessToken,
        'Access',
      );
      if (!tokenPayload) {
        throw new UnauthorizedException(
          HttpStatus.UNAUTHORIZED,
          'access token not valid',
        );
      }
      return this.tokenService.deleteTokenPair(tokenPayload.id);
    } catch (e) {
      throw new HttpException('token not valid', 402);
    }
  }

  //validation User from password
  private async _validate(data: LoginUserDto) {
    try {
      const userFromDb = await this.userService.getUserByEmail(data.email);
      const checkPassword = await bcrypt.compare(
        data.password,
        userFromDb.password,
      );
      if (userFromDb && checkPassword) {
        return userFromDb;
      }
      throw new HttpException('wrong email or password', 404);
    } catch (e) {
      throw new HttpException(e.message, 404);
    }
  }

  async refresh(refreshToken: string) {
    try {
      const tokenPayload = await this.tokenService.verifyToken(
        refreshToken,
        'Refresh',
      );
      const tokenPairByUserId = await this.tokenService.getTokenPairByUserId(
        tokenPayload.id,
      );
      if (!tokenPayload || refreshToken !== tokenPairByUserId.refreshToken) {
        throw new HttpException('token not valid', 402);
      }
      await this.tokenService.deleteTokenPair(tokenPayload.id);
      return this.tokenService.generateToken(tokenPayload);
    } catch (e) {
      throw new HttpException('token not valid', 402);
    }
  }

  sendResetPasswordEmail(email: string, token: string): void {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'traccy.ag@gmail.com', // Gmail email address
        pass: 'xszsriicflnocxlf', // Gmail password or App Password
      },
    });

    const mailOptions = {
      from: 'traccy.ag@gmail.com',
      to: email,
      subject: 'Your Password from App Traccy',
      text: `For change you password go to link: ${process.env.FE_URL}/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending reset password email:', error);
      } else {
        console.log('Reset password email sent:', info.response);
      }
    });
  }

  async updatePassword(token: string, newPassword: string) {
    try {
      const { email } = this.tokenService.verifyToken(token, 'Action');
      let userByEmail = await this.userService.getUserByEmail(email);
      if (!userByEmail) {
        throw new Error('No such user');
      }
      const hashPassword = await bcrypt.hash(newPassword, 10);
      await this.userService.updateUser(email, { password: hashPassword });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
