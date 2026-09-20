import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[
        character
      ] || character,
  );

export interface IMailProvider {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

@Injectable()
export class ConsoleMailProvider implements IMailProvider {
  sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(
      `[MailService] Sending email to ${to} with subject "${subject}"`,
    );
    console.log(body);
    return Promise.resolve();
  }
}

@Injectable()
export class ResendMailProvider implements IMailProvider {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const from = this.configService.get<string>(
      'MAIL_FROM',
      'kenneth.jesus@olustack.com.br',
    );

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
  constructor(
    @InjectQueue('mail') private mailQueue: Queue,
    private configService: ConfigService,
  ) {}

  private enqueue(data: { to: string; subject: string; body: string }) {
    return this.mailQueue.add('send-email', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1_000 },
      removeOnComplete: 100,
      removeOnFail: 100,
    });
  }

  async sendWelcome(email: string) {
    await this.enqueue({
      to: email,
      subject: 'Welcome to Portfolio',
      body: '<h1>Thank you for joining!</h1>',
    });
  }

  async sendContactAlert(contact: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    await this.enqueue({
      to: this.configService.get<string>(
        'CONTACT_ALERT_RECIPIENT',
        this.configService.get<string>(
          'ADMIN_EMAIL',
          'kenneth.jesus@olustack.com.br',
        ),
      ),
      subject: escapeHtml(contact.subject || 'Novo contato pelo portfólio'),
      body: `<h1>Novo contato</h1><p><strong>Nome:</strong> ${escapeHtml(contact.name)}</p><p><strong>E-mail:</strong> ${escapeHtml(contact.email)}</p><p><strong>Mensagem:</strong></p><p>${escapeHtml(contact.message)}</p>`,
    });
  }

  // Generic method for other usages
  async send(to: string, subject: string, body: string) {
    await this.enqueue({
      to,
      subject,
      body,
    });
  }
}
