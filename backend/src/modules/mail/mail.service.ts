import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export interface IMailProvider {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

@Injectable()
export class ConsoleMailProvider implements IMailProvider {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`[MailService] Sending email to ${to} with subject "${subject}"`);
    console.log(body);
  }
}

@Injectable()
export class ResendMailProvider implements IMailProvider {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const from = this.configService.get('MAIL_FROM', 'onboarding@resend.dev');
    
    await this.resend.emails.send({
      from,
      to,
      subject,
      html: body,
    });
  }
}

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private mailQueue: Queue) {}

  async sendWelcome(email: string) {
    await this.mailQueue.add('send-email', {
      to: email,
      subject: 'Welcome to Portfolio',
      body: '<h1>Thank you for joining!</h1>',
    });
  }

  // Generic method for other usages
  async send(to: string, subject: string, body: string) {
    await this.mailQueue.add('send-email', {
      to,
      subject,
      body,
    });
  }
}
