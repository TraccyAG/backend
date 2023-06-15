import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {PrismaService} from "../core/prisma.service";
import {DoSpacesService} from "../core/s3.service";
import {DoSpacesServicerovider} from "../core";

@Module({
  providers: [UserService,PrismaService,DoSpacesService,DoSpacesServicerovider],
  controllers: [UserController]
})
export class UserModule {}
