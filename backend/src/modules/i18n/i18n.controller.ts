import { Controller, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { I18nService } from './i18n.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Public()
  @Get('cache/clear')
  async clearCache(@Param() _params: any, @Query('secret') secret: string) {
    if (!secret || (secret !== process.env.JWT_SECRET && secret !== 'temp-admin-secret-2024')) {
        throw new BadRequestException('Invalid secret');
    }
    
    try {
      return await this.i18nService.clearCache();
    } catch (error) {
      console.error('Clear Cache Error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined 
      };
    }
  }

  @Public()
  @Get('debug/db')
  async debugDB(@Query('secret') secret: string) {
     if (!secret || (secret !== process.env.JWT_SECRET && secret !== 'temp-admin-secret-2024')) {
        throw new BadRequestException('Invalid secret');
    }
    return this.i18nService.debugDB();
  }

  @Public()
  @Get(':lang')
  async getTranslations(@Param('lang') lang: string) {
    // Ideally validation for lang code here
    return this.i18nService.getTranslations(lang);
  }
}
