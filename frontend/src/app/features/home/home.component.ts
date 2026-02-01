import { Component, inject } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      
      <!-- Badge -->
      <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
        <span class="w-1.5 h-1.5 rounded-full bg-tech-blue animate-pulse"></span>
        <span class="text-xs text-gray-300 tracking-wide uppercase">{{ 'HOME_BADGE' | translate }}</span>
      </div>

      <!-- Hero Title -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
        <span class="text-gray-100">{{ 'HOME_TITLE_1' | translate }}</span>
        <br class="hidden sm:block" />
        <span class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-tech-blue via-cyan-400 to-tech-blue">
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
        <a routerLink="/projects" class="w-full sm:w-auto px-8 py-4 rounded-full bg-tech-blue text-black font-bold text-lg hover:bg-tech-blue/80 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-tech-blue/25">
          {{ 'BTN_VIEW_PROJECTS' | translate }}
        </a>
        <a routerLink="/contact" class="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all font-medium backdrop-blur-sm hover:border-tech-blue/50">
          {{ 'BTN_CONTACT' | translate }}
        </a>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div class="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div class="w-1 h-2 bg-white/40 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Tech Stack Strip -->
    <div class="w-full border-y border-white/5 bg-black/30 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 py-10">
        <p class="text-center text-gray-500 text-sm uppercase tracking-widest mb-6">{{ 'HOME_STACK_TITLE' | translate }}</p>
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
          <div class="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
            <span class="text-2xl">🐳</span>
            <span class="font-semibold">Docker</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  langService = inject(LanguageService);
}
