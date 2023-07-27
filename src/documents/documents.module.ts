import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DoSpacesService } from '../core/s3.service';
import { DoSpacesServicerovider } from '../core';
import { UserService } from '../user/user.service';
import { PrismaService } from '../core/prisma.service';

@Module({
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    DoSpacesService,
    DoSpacesServicerovider,
    UserService,
    PrismaService,
  ],
})
export class DocumentsModule {}
