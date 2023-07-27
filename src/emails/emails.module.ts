import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { PrismaService } from '../core/prisma.service';

@Module({
  providers: [EmailsService, PrismaService],
  controllers: [EmailsController],
})
export class EmailsModule {}
