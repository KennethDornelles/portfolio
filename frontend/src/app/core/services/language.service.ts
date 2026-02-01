import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private http = inject(HttpClient);
  
  // Signal for current language
  readonly currentLang = signal<string>('PT_BR');
  
  // Signal for translations dictionary
  readonly translations = signal<Record<string, string>>({});

  // Signal for loading state
  readonly isLoading = signal<boolean>(false);

  constructor() {
    this.loadTranslations(this.currentLang());
  }

  setLanguage(lang: string) {
    this.currentLang.set(lang);
    this.loadTranslations(lang);
  }

  translate(key: string): string {
    const map = this.translations();
    return map[key] || key;
  }

  // Helper signal for templates if needed, or just use method
  // t = computed(() => (key: string) => this.translations()[key] || key);

  private async loadTranslations(lang: string) {
    this.isLoading.set(true);
    try {
      // Assuming environment.apiUrl is defined, otherwise fallback to relative
      const url = `${environment.apiUrl || 'http://localhost:3000'}/i18n/${lang}`;
      const data = await firstValueFrom(this.http.get<Record<string, string>>(url));
      this.translations.set(data || {});
    } catch (error) {
      console.error('Failed to load translations', error);
      // Optional: Retry logic could go here
    } finally {
      this.isLoading.set(false);
    }
  }
}
