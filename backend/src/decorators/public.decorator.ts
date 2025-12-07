import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para marcar rotas como públicas
 * Rotas marcadas com @Public() não precisam de autenticação com API Key
 *
 * @example
 * ```typescript
 * @Public()
 * @Get()
 * findAll() {
 *   return this.service.findAll();
 * }
 * ```
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
