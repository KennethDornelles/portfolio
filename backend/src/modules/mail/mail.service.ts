import { Injectable, Inject } from '@nestjs/common';

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
export class MailService {
  constructor(@Inject('MAIL_PROVIDER') private provider: IMailProvider) {}

  async sendWelcome(email: string) {
    await this.provider.sendEmail(email, 'Welcome to BarberBoss', 'Thank you for joining!');
  }
}
