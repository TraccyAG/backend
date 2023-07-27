import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './core/prisma.service';
import { TokenService } from './auth/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { EmailsModule } from './emails/emails.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [UserModule, AuthModule, EmailsModule, DocumentsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, TokenService, JwtService],
})
export class AppModule {}
