import { Component, inject } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <div
      class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center"
    >
      <!-- Badge -->
      <div
        class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-tech-blue animate-pulse"></span>
        <span class="text-xs text-gray-300 tracking-wide uppercase">{{
          'HOME_BADGE' | translate
        }}</span>
      </div>

      <!-- Positioning -->
      @if (langService.translate('HOME_ROLE') !== 'HOME_ROLE') {
        <p
          class="text-sm sm:text-base font-semibold tracking-[0.2em] uppercase text-tech-blue mb-4"
        >
          {{ 'HOME_ROLE' | translate }}
        </p>
      }

      <!-- Hero Title -->
      <h1
        class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
      >
        <span class="text-gray-100">{{ 'HOME_TITLE_1' | translate }}</span>
        <br class="hidden sm:block" />
        <span
          class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-tech-blue via-cyan-400 to-tech-blue"
        >
          {{ 'HOME_TITLE_HIGHLIGHT' | translate }}
        </span>
        <br class="hidden md:block" />
        <span class="text-gray-100">{{ 'HOME_TITLE_2' | translate }}</span>
      </h1>

      <!-- Subtitle -->
      <p class="max-w-3xl text-lg md:text-xl lg:text-2xl text-gray-400 mb-12 leading-relaxed">
        {{ 'HOME_HERO_DESC' | translate }}
        <!-- Note: Ideally we would interpolate bold words, but for now we trust the sentence structure or use specific span keys if strictly required. 
             Based on prompt requirements for "Backend" and "high performance": -->
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <a
          routerLink="/projects"
          (click)="trackCta('view_projects')"
          class="w-full sm:w-auto px-8 py-4 rounded-full bg-tech-blue text-black font-bold text-lg hover:bg-tech-blue/80 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-tech-blue/25"
        >
          {{ 'BTN_VIEW_PROJECTS' | translate }}
        </a>
        <a
          routerLink="/contact"
          (click)="trackCta('contact')"
          class="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all font-medium backdrop-blur-sm hover:border-tech-blue/50"
        >
          {{ 'BTN_CONTACT' | translate }}
        </a>
      </div>

      <!-- Scroll Indicator -->
      <div aria-hidden="true" class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div
          class="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
        >
          <div class="w-1 h-2 bg-white/40 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Narrative proof -->
    <section class="border-y border-white/5 bg-white/[0.02] px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-tech-blue">
            {{ 'HOME_ROLE' | translate }}
          </p>
          <h2 class="max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl">
            {{ 'HOME_PROOF_TITLE' | translate }}
          </h2>
          <p class="mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
            {{ 'HOME_PROOF_DESC' | translate }}
          </p>
        </div>
        <div class="grid gap-3">
          @for (item of proofItems; track item) {
            <div
              class="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-gray-200"
            >
              <span
                class="flex h-7 w-7 items-center justify-center rounded-full bg-tech-blue/15 text-tech-blue"
                aria-hidden="true"
                >✓</span
              >
              <span>{{ item | translate }}</span>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Tech Stack Strip -->
    <div class="w-full border-y border-white/5 bg-black/30 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 py-10">
        <p class="text-center text-gray-500 text-sm uppercase tracking-widest mb-6">
          {{ 'HOME_STACK_TITLE' | translate }}
        </p>
        <div class="flex flex-wrap justify-center gap-x-12 gap-y-4">
          <div class="flex items-center gap-2 text-gray-400 hover:text-tech-blue transition-colors">
            <span class="text-2xl">⚡</span>
            <span class="font-semibold">{{ 'TECH_NESTJS' | translate }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
            <span class="text-2xl">🅰️</span>
            <span class="font-semibold">Angular</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
            <span class="text-2xl">🐘</span>
            <span class="font-semibold">PostgreSQL</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors">
            <span class="text-2xl">🔷</span>
            <span class="font-semibold">TypeScript</span>
          </div>
          <div
            class="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <span class="text-2xl">🐳</span>
            <span class="font-semibold">Docker</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {
  langService = inject(LanguageService);
  private readonly analytics = inject(AnalyticsService);
  readonly proofItems = ['HOME_PROOF_ITEM_1', 'HOME_PROOF_ITEM_2', 'HOME_PROOF_ITEM_3'];

  trackCta(target: string): void {
    this.analytics.track('cta_click', { target, location: 'home_hero' });
  }
}
