import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedMulterFileI } from '../core';
import { DoSpacesService } from '../core/s3.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly doSpacesService: DoSpacesService,
  ) {}

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @UseInterceptors(FileInterceptor('file')) // FileInterceptor to handle file upload
  @Post(':userId/agreements')
  async createAgreement(
    @Param('userId') userId: string,
    @UploadedFile() file: UploadedMulterFileI,
  ) {
    const url = await this.doSpacesService.uploadFile(file);
    return this.userService.createAgreement(userId, url as string);
  }

  @Patch('update/:id')
  public async updateUser(
    @Param('id') id: string,
    @Body() userData: Partial<User>,
  ) {
    const userByEmail = await this.userService.getUserByEmail(userData.email);
    const userById = await this.userService.getUserById(id);
    if (!userById || !userByEmail || userByEmail.id !== userById.id)
      throw new HttpException(
        'User cannot be identified',
        HttpStatus.NOT_FOUND,
      );
    return this.userService.updateUser(userByEmail.email, userData);
  }

  @Delete('/delete')
  deleteUser(@Body() email: any) {
    return this.userService.deleteUser(email);
  }
}
