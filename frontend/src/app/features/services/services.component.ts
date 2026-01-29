import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

interface ServiceItem {
  titleKey: string;
  descriptionKey: string;
}

interface ServiceCategory {
  icon: string;
  titleKey: string;
  subtitleKey: string;
  color: string;
  borderColor: string;
  items: ServiceItem[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        
        <!-- Header -->
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 bg-tech-blue/10 text-tech-blue rounded-full text-sm font-medium uppercase tracking-wider mb-4">
            {{ 'SERVICES_LABEL' | translate }}
          </span>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            {{ 'SERVICES_TITLE_PREFIX' | translate }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-tech-blue to-purple-500">{{ 'SERVICES_TITLE_SUFFIX' | translate }}</span>
          </h1>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">
            {{ 'SERVICES_DESC' | translate }}
          </p>
        </div>

        <!-- Services Grid -->
        <div class="space-y-12">
          @for (category of services(); track category.titleKey) {
            <div class="group">
              <!-- Category Header -->
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                     [class]="'bg-' + category.color + '/10'">
                  {{ category.icon }}
                </div>
                <div>
                  <h2 class="text-2xl md:text-3xl font-bold text-white">{{ category.titleKey | translate }}</h2>
                  <p class="text-gray-400 text-sm">{{ category.subtitleKey | translate }}</p>
                </div>
              </div>

              <!-- Category Items -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pl-0 md:pl-[4.5rem]">
                @for (item of category.items; track item.titleKey) {
                  <div class="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-tech-blue/30 transition-all duration-300 hover:-translate-y-1">
                    <h3 class="text-lg font-bold text-white mb-2">{{ item.titleKey | translate }}</h3>
                    <p class="text-gray-400 text-sm leading-relaxed">{{ item.descriptionKey | translate }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- CTA Section -->
        <div class="mt-20 text-center">
          <div class="inline-block p-8 md:p-12 bg-gradient-to-br from-tech-blue/10 via-purple-500/5 to-transparent rounded-3xl border border-white/10">
            <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">{{ 'SERVICES_CTA_TITLE' | translate }}</h3>
            <p class="text-gray-400 mb-8 max-w-lg mx-auto">
              {{ 'SERVICES_CTA_DESC' | translate }}
            </p>
            <a routerLink="/contact" class="inline-block px-8 py-4 bg-tech-blue text-black font-bold rounded-full hover:bg-tech-blue/80 transition-all hover:scale-105">
              {{ 'BTN_REQUEST_QUOTE' | translate }}
            </a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ServicesComponent {
  langService = inject(LanguageService);

  services = signal<ServiceCategory[]>([
    {
      icon: '💻',
      titleKey: 'SVC_WEB_TITLE',
      subtitleKey: 'SVC_WEB_SUB',
      color: 'tech-blue',
      borderColor: 'tech-blue',
      items: [
        { titleKey: 'SVC_WEB_ITEM_1_TITLE', descriptionKey: 'SVC_WEB_ITEM_1_DESC' },
        { titleKey: 'SVC_WEB_ITEM_2_TITLE', descriptionKey: 'SVC_WEB_ITEM_2_DESC' },
        { titleKey: 'SVC_WEB_ITEM_3_TITLE', descriptionKey: 'SVC_WEB_ITEM_3_DESC' }
      ]
    },
    {
      icon: '🏗️',
      titleKey: 'SVC_CONSULT_TITLE',
      subtitleKey: 'SVC_CONSULT_SUB',
      color: 'purple-500',
      borderColor: 'purple-500',
      items: [
        { titleKey: 'SVC_CONSULT_ITEM_1_TITLE', descriptionKey: 'SVC_CONSULT_ITEM_1_DESC' },
        { titleKey: 'SVC_CONSULT_ITEM_2_TITLE', descriptionKey: 'SVC_CONSULT_ITEM_2_DESC' },
        { titleKey: 'SVC_CONSULT_ITEM_3_TITLE', descriptionKey: 'SVC_CONSULT_ITEM_3_DESC' }
      ]
    },
    {
      icon: '📍',
      titleKey: 'SVC_GEO_TITLE',
      subtitleKey: 'SVC_GEO_SUB',
      color: 'green-500',
      borderColor: 'green-500',
      items: [
        { titleKey: 'SVC_GEO_ITEM_1_TITLE', descriptionKey: 'SVC_GEO_ITEM_1_DESC' },
        { titleKey: 'SVC_GEO_ITEM_2_TITLE', descriptionKey: 'SVC_GEO_ITEM_2_DESC' }
      ]
    },
    {
      icon: '🌍',
      titleKey: 'SVC_I18N_TITLE',
      subtitleKey: 'SVC_I18N_SUB',
      color: 'orange-500',
      borderColor: 'orange-500',
      items: [
        { titleKey: 'SVC_I18N_ITEM_1_TITLE', descriptionKey: 'SVC_I18N_ITEM_1_DESC' }
      ]
    }
  ]);
}
