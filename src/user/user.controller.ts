import {Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {UserService} from "./user.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {UploadedMulterFileI} from "../core";
import {DoSpacesService} from "../core/s3.service";

@Controller('user')
export class UserController {
    constructor(private userService: UserService, private readonly doSpacesService: DoSpacesService,) {
    }

    @Get("/:id")
    getUserById(@Param("id") id: string) {
        return this.userService.getUserById(id);
    }

    @UseInterceptors(FileInterceptor('file')) // FileInterceptor to handle file upload
    @Post(':userId/agreements')
    async createAgreement(
        @Param('userId') userId: string,
        @UploadedFile() file: UploadedMulterFileI
    ) {
        const url = await this.doSpacesService.uploadFile(file);
        return this.userService.createAgreement(userId, url as string);
    }

    @Delete('/delete')
    deleteUser(@Body() email: any) {
        return this.userService.deleteUser(email)
    }
}
