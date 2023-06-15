import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { TokenService } from "./token/token.service";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  //registration user
  async registration(data: CreateUserDto) {
    try {
      const user = await this.userService.getUserByEmail(data.email);

      if (user) {
        return new HttpException(
          "user is already exist",
          HttpStatus.BAD_REQUEST
        );
      }
      const hashPassword = await bcrypt.hash(data.password, 10);
      const savedUser = await this.userService.createUser({
        ...data,
        age: Number(data.age),
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
          "wrong email or password"
        );
      }

      if (userFromDb) {
        const tokenPairFromDb = await this.tokenService.getTokenPairByUserId(
          userFromDb.id
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
        "Access"
      );
      if (!tokenPayload) {
        throw new UnauthorizedException(
          HttpStatus.UNAUTHORIZED,
          "access token not valid"
        );
      }
      return this.tokenService.deleteTokenPair(tokenPayload.id);
    } catch (e) {
      throw new HttpException("token not valid", 402);
    }
  }

  //validation User from password
  private async _validate(data: LoginUserDto) {
    try {
      const userFromDb = await this.userService.getUserByEmail(data.email);
      const checkPassword = await bcrypt.compare(
        data.password,
        userFromDb.password
      );
      if (userFromDb && checkPassword) {
        return userFromDb;
      }
      throw new HttpException("wrong email or password", 404);
    } catch (e) {
      throw new HttpException(e.message, 404);
    }
  }

  async refresh(refreshToken: string) {
    try {
      const tokenPayload = await this.tokenService.verifyToken(
        refreshToken,
        "Refresh"
      );
      console.log(tokenPayload);
      const tokenPairByUserId = await this.tokenService.getTokenPairByUserId(
        tokenPayload.id
      );
      if (!tokenPayload || refreshToken !== tokenPairByUserId.refreshToken) {
        throw new HttpException("token not valid", 402);
      }
      await this.tokenService.deleteTokenPair(tokenPayload.id);
      return this.tokenService.generateToken(tokenPayload);
    } catch (e) {
      throw new HttpException("token not valid", 402);
    }
  }
}
