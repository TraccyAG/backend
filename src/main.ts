import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {config} from 'dotenv';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    // Increase payload size limit
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    await app.listen(process.env.PORT || 5000);
    console.log(`start server on port:${process.env.PORT}`)
}

config();
bootstrap();
