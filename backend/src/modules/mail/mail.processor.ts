
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';
import { IMailProvider } from './mail.service';

@Processor('mail')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(@Inject('MAIL_PROVIDER') private provider: IMailProvider) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
    
    switch (job.name) {
      case 'send-email':
        const { to, subject, body } = job.data;
        await this.provider.sendEmail(to, subject, body);
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }
}
