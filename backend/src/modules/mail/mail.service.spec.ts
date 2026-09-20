import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

describe('MailService', () => {
  it('enqueues contact alerts with retries and escaped content', async () => {
    const add = jest.fn().mockResolvedValue({ id: 'job-1' });
    const service = new MailService(
      { add } as never,
      {
        get: jest.fn((key: string, fallback?: string) =>
          key === 'CONTACT_ALERT_RECIPIENT' ? 'alerts@example.com' : fallback,
        ),
      } as unknown as ConfigService,
    );

    await service.sendContactAlert({
      name: '<script>alert(1)</script>',
      email: 'visitor@example.com',
      subject: 'Olá',
      message: '<b>Mensagem</b>',
    });

    expect(add).toHaveBeenCalledWith(
      'send-email',
      expect.objectContaining({
        to: 'alerts@example.com',
        // Jest asymmetric matchers are intentionally untyped.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: expect.stringContaining('&lt;script&gt;alert(1)&lt;/script&gt;'),
      }),
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1_000 },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    );
  });
});
