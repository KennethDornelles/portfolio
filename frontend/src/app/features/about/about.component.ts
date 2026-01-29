import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        
        <!-- Header Section -->
        <div class="text-center mb-16">
          <div class="relative inline-block mb-8">
            <div class="w-44 h-44 rounded-full bg-gradient-to-br from-tech-blue via-cyan-500 to-purple-600 p-1 shadow-2xl shadow-tech-blue/20">
              <img src="assets/avatar.svg" alt="Kenneth Olusegun" 
                   class="w-full h-full rounded-full object-cover bg-graphite-950">
            </div>
            <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-tech-blue rounded-full flex items-center justify-center text-xl border-4 border-graphite-950 shadow-lg">
              🚀
            </div>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-3">
            {{ 'ABOUT_TITLE_PREFIX' | translate }} <span class="text-tech-blue">{{ 'ABOUT_TITLE_SUFFIX' | translate }}</span>
          </h1>
          <p class="text-xl text-gray-400 font-medium">
            {{ 'ABOUT_ROLE' | translate }}
          </p>
        </div>

        <!-- Bio Section -->
        <div class="mb-20">
          <div class="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12">
            <p class="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              {{ 'ABOUT_BIO_1' | translate }}
            </p>
            <p class="text-lg md:text-xl text-gray-300 leading-relaxed">
              {{ 'ABOUT_BIO_2' | translate }}
            </p>
          </div>
        </div>

        <!-- The Edge Section -->
        <div class="mb-20">
          <div class="text-center mb-12">
            <span class="inline-block px-4 py-2 bg-tech-blue/10 text-tech-blue rounded-full text-sm font-medium uppercase tracking-wider mb-4">
              {{ 'ABOUT_EDGE_LABEL' | translate }}
            </span>
            <h2 class="text-3xl md:text-4xl font-bold text-white">
              {{ 'ABOUT_EDGE_TITLE' | translate }}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Card 1 -->
            <div class="group p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-tech-blue/50 transition-all duration-300 hover:-translate-y-1">
              <div class="w-14 h-14 bg-tech-blue/10 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🏗️
              </div>
              <h3 class="text-xl font-bold text-white mb-3">{{ 'ABOUT_CARD_1_TITLE' | translate }}</h3>
              <p class="text-gray-400 leading-relaxed">
                {{ 'ABOUT_CARD_1_DESC' | translate }}
              </p>
            </div>

            <!-- Card 2 -->
            <div class="group p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1">
              <div class="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                💡
              </div>
              <h3 class="text-xl font-bold text-white mb-3">{{ 'ABOUT_CARD_2_TITLE' | translate }}</h3>
              <p class="text-gray-400 leading-relaxed">
                {{ 'ABOUT_CARD_2_DESC' | translate }}
              </p>
            </div>

            <!-- Card 3 -->
            <div class="group p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1">
              <div class="w-14 h-14 bg-cyan-400/10 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 class="text-xl font-bold text-white mb-3">{{ 'ABOUT_CARD_3_TITLE' | translate }}</h3>
              <p class="text-gray-400 leading-relaxed">
                {{ 'ABOUT_CARD_3_DESC' | translate }}
              </p>
            </div>

            <!-- Card 4 -->
            <div class="group p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1">
              <div class="w-14 h-14 bg-blue-400/10 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 class="text-xl font-bold text-white mb-3">{{ 'ABOUT_CARD_4_TITLE' | translate }}</h3>
              <p class="text-gray-400 leading-relaxed">
                {{ 'ABOUT_CARD_4_DESC' | translate }}
              </p>
            </div>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="mb-20">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div class="text-4xl font-bold text-tech-blue mb-1">5+</div>
              <div class="text-gray-400 text-sm">{{ 'ABOUT_STATS_EXP' | translate }}</div>
            </div>
            <div class="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div class="text-4xl font-bold text-purple-400 mb-1">50+</div>
              <div class="text-gray-400 text-sm">{{ 'ABOUT_STATS_PROJECTS' | translate }}</div>
            </div>
            <div class="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div class="text-4xl font-bold text-cyan-400 mb-1">2</div>
              <div class="text-gray-400 text-sm">{{ 'ABOUT_STATS_PRODUCTS' | translate }}</div>
            </div>
            <div class="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div class="text-4xl font-bold text-orange-400 mb-1">∞</div>
              <div class="text-gray-400 text-sm">{{ 'ABOUT_STATS_COFFEE' | translate }}</div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center">
          <div class="inline-block p-8 md:p-12 bg-gradient-to-br from-tech-blue/10 via-purple-500/5 to-transparent rounded-3xl border border-white/10">
            <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">{{ 'ABOUT_CTA_TITLE' | translate }}</h3>
            <p class="text-gray-400 mb-8 max-w-lg mx-auto">
              {{ 'ABOUT_CTA_DESC' | translate }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a routerLink="/contact" class="px-8 py-4 bg-tech-blue text-black font-bold rounded-full hover:bg-tech-blue/80 transition-all hover:scale-105">
                {{ 'BTN_START_CONVERSATION' | translate }}
              </a>
              <a href="https://linkedin.com/in/kennethjesus" target="_blank" 
                 class="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <span>💼</span> LinkedIn
              </a>
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div class="flex justify-center gap-6 mt-12">
          <a href="https://github.com/KennethDornelles" target="_blank" 
             class="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-2xl hover:scale-110">
            🐙
          </a>
          <a href="https://linkedin.com/in/kennethjesus" target="_blank" 
             class="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-2xl hover:scale-110">
            💼
          </a>
          <a href="mailto:contact@olustack.dev" 
             class="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-2xl hover:scale-110">
            ✉️
          </a>
        </div>
      </div>
    </section>
  `
})
export class AboutComponent {
  langService = inject(LanguageService);

}
