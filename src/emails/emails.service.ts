import { Injectable } from '@nestjs/common';
import {PrismaService} from "../core/prisma.service";
import {Emails} from "@prisma/client";


@Injectable()
export class EmailsService {
    constructor(private readonly prisma: PrismaService) {} // Inject the Prisma service

    async createEmail(data: Emails): Promise<Emails> {
        return this.prisma.emails.create({ data });
    }
}
