import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

export type SupportedLanguage = 'PT_BR' | 'EN_US';
export type TranslationLoadState = 'idle' | 'loading' | 'ready' | 'error';

const REQUIRED_TRANSLATION_KEYS = ['NAV_HOME', 'HOME_TITLE_1', 'BTN_VIEW_PROJECTS'] as const;

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly http = inject(HttpClient);
  private requestId = 0;

  readonly currentLang = signal<SupportedLanguage>('PT_BR');
  readonly translations = signal<Record<string, string>>({});
  readonly state = signal<TranslationLoadState>('idle');
  readonly errorMessage = signal<string | null>(null);

  async initialize(): Promise<void> {
    await this.loadTranslations(this.currentLang(), true);
  }

  async setLanguage(lang: SupportedLanguage): Promise<void> {
    if (lang === this.currentLang() && this.state() === 'ready') return;
    await this.loadTranslations(lang, false);
  }

  translate(key: string): string {
    const map = this.translations();
    return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : key;
  }

  private async loadTranslations(lang: SupportedLanguage, initialLoad: boolean): Promise<void> {
    const activeRequest = ++this.requestId;
    this.state.set('loading');
    this.errorMessage.set(null);

    try {
      const response = await firstValueFrom(
        this.http.get<unknown>(`${environment.apiUrl}/i18n/${lang}`).pipe(timeout(3000))
      );
      const translations = this.validateTranslations(response);

      if (activeRequest !== this.requestId) return;

      this.translations.set(translations);
      this.currentLang.set(lang);
      this.state.set('ready');
    } catch {
      if (activeRequest !== this.requestId) return;

      this.state.set(initialLoad ? 'error' : 'ready');
      this.errorMessage.set(
        initialLoad
          ? 'Não foi possível carregar os textos da aplicação. Tente novamente.'
          : 'Não foi possível alterar o idioma. O idioma anterior foi mantido.'
      );
    }
  }

  private validateTranslations(value: unknown): Record<string, string> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('Invalid translation response');
    }

    const entries = Object.entries(value);
    if (entries.length === 0 || entries.some(([, translation]) => typeof translation !== 'string')) {
      throw new Error('Invalid translation response');
    }

    const map = value as Record<string, string>;
    if (REQUIRED_TRANSLATION_KEYS.some((key) => !map[key])) {
      throw new Error('Incomplete translation response');
    }

    return map;
  }
}
