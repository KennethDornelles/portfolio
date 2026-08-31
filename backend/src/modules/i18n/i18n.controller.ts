import {
  Controller,
  Get,
  Param,
  Post,
  ServiceUnavailableException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PerformanceInterceptor } from '../../common/interceptors/performance.interceptor';
import { I18nService } from './i18n.service';
import { I18nWebhookGuard } from './i18n-webhook.guard';

@Controller('i18n')
@UseInterceptors(PerformanceInterceptor)
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Public()
  @UseGuards(I18nWebhookGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('webhook/deploy')
  async handleDeployWebhook() {
    await this.i18nService.refreshCache();
    return { success: true };
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get('health/cache')
  async cacheHealth() {
    return this.i18nService.getCacheHealth();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('cache/clear')
  async clearCache() {
    const result = await this.i18nService.clearCache();
    if (!result.success) {
      throw new ServiceUnavailableException('I18n cache operation failed');
    }
    return { success: true };
  }

  @Public()
  @Get(':lang')
  async getTranslations(@Param('lang') lang: string) {
    return this.i18nService.getTranslations(lang);
  }
}
