const REQUIRED_SECRETS = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'I18N_WEBHOOK_SECRET',
] as const;

const MINIMUM_SECRET_LENGTH = 32;

export function validateEnvironment(
  environment: Record<string, unknown>,
): Record<string, unknown> {
  for (const name of REQUIRED_SECRETS) {
    const value = environment[name];

    if (typeof value !== 'string' || value.length < MINIMUM_SECRET_LENGTH) {
      throw new Error(
        `${name} must be configured with at least ${MINIMUM_SECRET_LENGTH} characters`,
      );
    }
  }

  if (environment.JWT_SECRET === environment.JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be different');
  }

  return environment;
}
