import { validateEnvironment } from './environment.validation';

const validEnvironment: Record<string, unknown> = {
  JWT_SECRET: 'access-secret-with-at-least-32-characters',
  JWT_REFRESH_SECRET: 'refresh-secret-with-at-least-32-characters',
  I18N_WEBHOOK_SECRET: 'webhook-secret-with-at-least-32-characters',
};

describe('validateEnvironment', () => {
  it.each(['JWT_SECRET', 'JWT_REFRESH_SECRET', 'I18N_WEBHOOK_SECRET'] as const)(
    'rejects a missing %s without exposing another secret',
    (name) => {
      const environment = { ...validEnvironment };
      delete environment[name];

      expect(() => validateEnvironment(environment)).toThrow(
        `${name} must be configured with at least 32 characters`,
      );
    },
  );

  it('rejects short secrets', () => {
    expect(() =>
      validateEnvironment({ ...validEnvironment, JWT_SECRET: 'too-short' }),
    ).toThrow('JWT_SECRET must be configured with at least 32 characters');
  });

  it('requires independent access and refresh signing secrets', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        JWT_REFRESH_SECRET: validEnvironment.JWT_SECRET,
      }),
    ).toThrow('JWT_SECRET and JWT_REFRESH_SECRET must be different');
  });

  it('returns a valid environment unchanged', () => {
    expect(validateEnvironment(validEnvironment)).toBe(validEnvironment);
  });
});
