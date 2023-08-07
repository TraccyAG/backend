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

  sendResetPasswordEmail(name: string, email: string, token: string): void {
    const transporter = nodemailer.createTransport({
      service: 'Outlook365',
      auth: {
        user: 'info@traccy.ch', // Gmail email address
        pass: 'bscpzmcnclkbykzc', // Gmail password or App Password
      },
    });

    const resetLink = `${process.env.FE_URL}/reset-password/${token}`;

    const mailOptions = {
      from: 'info@traccy.ch',
      to: email,
      subject: 'Password Reset for Your Traccy Account',
      html: ` 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traccy AG: Thank you for your message</title>
    <style>
        body {
            font-family: Calibri, sans-serif;
            margin: 0;
            padding: 0;
            color: #404040;
        }

        h2 {
            font-size: 18px;
            margin-bottom: 10px;
        }

        p {
            font-size: 14px;
            margin: 0;
        }

        .logo {
            width: 173px;
            height: 38px;
        }

        .footer_img {
            width: 100%;
            margin-top: 20px;
        }
    </style>
</head>
<body>
<div style="padding: 30px; font-size: 16px">
    <br>
    <div style="color: black">Dear  ${name}</div>
    <br>
    <div style="color: black">
        We have received a request to reset your password. To ensure your security and confirm that only you have access
        to your account, you can reset your password using the following link:
    </div>
    <br>
    <a href=${resetLink} target="_blank">${resetLink}</a>
    <br>
    <br>
    <div style="color: black">
        If you did not make this request or prefer not to reset your password at this time, please disregard this email,
        and your account details will remain unchanged.
    </div>
    <br>
    <div style="color: black">
        Please note that the link is valid for a limited time to ensure the security of your account. If the link
        expires, you can request a new password reset link through our website.
    </div>
    <br>
    <div style="color: black">
        We recommend choosing a strong and secure password that includes a combination of uppercase and lowercase
        letters,
        numbers, and special characters. Avoid using easily guessable passwords such as birth dates or simple words.
    </div>
    <br>
    <div style="color: black">
        Ensuring the safety of your data and maintaining the security of your account is our top priority. If you have
        any
        further questions or concerns, please do not hesitate to contact our support team.
    </div>
    <br>
    <div style="color: black">
        Thank you for your attention and understanding.
    </div>
    <br>
    <div style="color: black">
        Best regards
    </div>
</div>
<div>
    <div style="display: flex;
            align-items: center;
            justify-content: flex-start;">
        <div style=
        "padding: 30px 20px;
         border-right: 4px solid #8a108c;">
            <img class="logo" src="https://portal.traccy.io/static/media/logo.5b267d8957c8c641526b.png"
                 alt="Traccy AG Logo">
        </div>
        <div style="padding-left: 20px;"> 
            <div style="font-size: 16px; color: black; font-weight: 500">Traccy AG</div>
            <div style="color: black; font-size: 12px">Support Team</div>
            <div>
                <span style="font-size: 12px; color: #8a108c;">phone</span>
                <span style="color: black; font-size: 12px">+41 43 810 29 51</span>
                <span style="font-size: 12px; color: #8a108c;">email</span>
                <a href="mailto:info@traccy.ch" style="font-size: 12px; text-decoration: underline">info@traccy.ch</a>
                <span style="font-size: 12px; color: #8a108c;">web</span>
                <a href="http://www.traccy.io/" target="_blank" style="font-size: 12px; text-decoration: underline">www.traccy.io</a>
            </div>
            <div>
                <span style="font-size: 12px; color: #8a108c;">address</span>
                <span style="font-size: 12px; color: black">Chaltenbodenstrasse 6a, 8834 Schindellegi</span>
            </div>
            <div style="display: flex; column-gap: 20px">
                <a href="https://web.telegram.org/z/#-1897696749">
                    <img src='https://ivanus.s3.amazonaws.com/traccy/image002.png' alt="logo" class="footer_img"
                         style="width: 13px; height: 13px">
                </a>
                <a href="https://twitter.com/home?lang=de">
                    <img src='https://ivanus.s3.amazonaws.com/traccy/image003.png' alt="logo" class="footer_img"
                         style="width: 13px; height: 13px">
                </a>
                <a href="https://www.instagram.com/traccy_official/">
                    <img src='https://ivanus.s3.amazonaws.com/traccy/image004.png' alt="logo" class="footer_img"
                         style="width: 13px; height: 13px">
                </a>
                <a href="https://www.linkedin.com/company/traccy-ag/?viewAsMember=true">
                    <img src='https://ivanus.s3.amazonaws.com/traccy/image005.png' alt="logo" class="footer_img"
                         style="width: 13px; height: 13px">
                </a>
            </div>
        </div>
    </div>
    <img src='https://ivanus.s3.amazonaws.com/traccy/footer.png' alt="logo" class="footer_img"
    style="width: 100%; height: 200px"
    >
</div>
</body>
</html>
  `,
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
      const userByEmail = await this.userService.getUserByEmail(email);
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
