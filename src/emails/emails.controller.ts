import { Body, Controller, Post } from '@nestjs/common';
import { Emails } from '@prisma/client';
import { EmailsService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post()
  async createEmail(@Body() data: Emails): Promise<Emails> {
    return this.emailsService.createEmail(data);
  }

  @Post('/send')
  async sendMail(@Body() data: any): Promise<void> {
    const { email, name } = data;
    return this.emailsService.sendMail(email, name);
  }
}
