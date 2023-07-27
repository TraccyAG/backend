import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [TokenService, JwtService, PrismaService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.tracy-be/.env',
    }),
  ],
})
export class TokenModule {}
