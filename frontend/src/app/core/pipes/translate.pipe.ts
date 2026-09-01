import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private langService = inject(LanguageService);

  transform(key: string, ...args: unknown[]): string {
    const translation = this.langService.translate(key);
    if (!args || args.length === 0) return translation;

    return translation.replace(/{(\d+)}/g, (match: string, indexStr: string): string => {
      const idx = parseInt(indexStr, 10);
      const val = args[idx];
      return typeof val !== 'undefined' && val !== null ? String(val) : match;
    });
  }
}
