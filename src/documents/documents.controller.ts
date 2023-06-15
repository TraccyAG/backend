import {Body, Controller, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {DocumentsService} from "./documents.service";
import {Response} from 'express';
import {FileInterceptor} from "@nestjs/platform-express";
import {UploadedMulterFileI} from "../core";
import {DoSpacesService} from "../core/s3.service";
import {UserService} from "../user/user.service";

@Controller('documents')
export class DocumentsController {
    constructor(private readonly pdfService: DocumentsService,private readonly doSpacesService: DoSpacesService,private userService:UserService) {
    }

    @UseInterceptors(FileInterceptor('file')) // FileInterceptor to handle file upload
    @Post('/:id')
    async createPdf(
        @Param("id") id: string,
        @UploadedFile() file: UploadedMulterFileI, @Body() data: any, @Res() res: Response) {
        try {
            const url = await this.doSpacesService.uploadFile(file);
            const pdfBytes = await this.pdfService.generatePdf(data,url);

            // const pdfUrl =  await this.doSpacesService.uploadFile(pdfBytes)
            // await this.userService.createAgreement(id,)
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=sample.pdf');

            res.write(pdfBytes);
            res.end();
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send('Error generating PDF');
        }
    }
}
