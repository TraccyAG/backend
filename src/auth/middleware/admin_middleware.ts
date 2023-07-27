import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { TokenService } from '../token/token.service';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(private tokenService: TokenService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const access_token = req.headers.authorization.split(' ')[1];

      const tokenPayload = await this.tokenService.verifyToken(
        access_token,
        'Access',
      );

      if (!tokenPayload) {
        next(
          new UnauthorizedException(
            HttpStatus.FORBIDDEN,
            'invalid token from access',
          ),
        );
      }
      const { role } = tokenPayload;

      if (role !== 'admin') {
        next(
          new UnauthorizedException(
            HttpStatus.FORBIDDEN,
            'forbidden resource, only for admin',
          ),
        );
      }
      next();
    } catch (e) {
      next(e.message);
    }
  }
}
