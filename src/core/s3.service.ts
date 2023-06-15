// doSpacesService.ts
import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {DoSpacesServiceLib, UploadedMulterFileI} from "./index";
import * as process from "process";
// Typical nestJs service
@Injectable()
export class DoSpacesService {
    constructor(@Inject(DoSpacesServiceLib) private readonly s3: AWS.S3) {}

    async uploadFile(file: UploadedMulterFileI,name?:string) {
        // Precaution to avoid having 2 files with the same name
        const fileName = `${Date.now()}-${
            file.originalname 
        }`|| name;

        // Return a promise that resolves only when the file upload is complete
        return new Promise((resolve, reject) => {
            this.s3.putObject(
                {
                    Bucket: process.env.BUCKET,
                    Key: fileName,
                    Body: file.buffer,
                    ACL: 'public-read',
                },
                (error: AWS.AWSError) => {
                    if (!error) {
                        resolve(`${process.env.DIGITAL_URL}/${fileName}`);
                    } else {
                        reject(
                            new Error(
                                `DoSpacesService_ERROR: ${error.message || 'Something went wrong'}`,
                            ),
                        );
                    }
                },
            );
        });
    }
}