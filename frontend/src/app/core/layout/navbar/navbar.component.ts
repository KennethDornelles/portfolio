import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 cursor-pointer" routerLink="/">
            <span class="text-xl font-bold tracking-tighter text-white">
              Olu<span class="text-tech-blue">Stack</span><span class="text-tech-blue">.</span>
            </span>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-8">
              <a routerLink="/" routerLinkActive="text-tech-blue" [routerLinkActiveOptions]="{exact: true}" 
                 class="text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">
                {{ t('NAV_HOME') }}
              </a>
              <a routerLink="/projects" routerLinkActive="text-tech-blue" 
                 class="text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">
                {{ t('NAV_PROJECTS') }}
              </a>
              <a routerLink="/services" routerLinkActive="text-tech-blue"
                 class="text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">
                {{ t('NAV_SERVICES') }}
              </a>
              <a routerLink="/about" routerLinkActive="text-tech-blue"
                 class="text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">
                {{ t('NAV_ABOUT') }}
              </a>
            </div>
          </div>

          <!-- Right Actions -->
          <div class="hidden md:flex items-center space-x-4">
            <!-- Language Selector -->
            <div class="flex items-center space-x-2 text-sm text-gray-400">
              <button (click)="switchLang('PT_BR')" [class.text-white]="langService.currentLang() === 'PT_BR'" class="hover:text-tech-blue transition-colors">PT</button>
              <span>/</span>
              <button (click)="switchLang('EN_US')" [class.text-white]="langService.currentLang() === 'EN_US'" class="hover:text-tech-blue transition-colors">EN</button>
            </div>

            <!-- Demo Mode Button -->
            <button (click)="loginAsGuest()" 
                    [class]="authService.isAuthenticated() ? 'bg-tech-blue/20 text-tech-blue border-tech-blue/30' : 'bg-white/5 text-white border-white/10 hover:border-tech-blue/50'"
                    class="border px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2">
              @if (isLoading) {
                <span class="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full"></span>
              }
              @if (authService.isAuthenticated()) {
                ✓ {{ t('NAV_DEMO') }}
              } @else {
                {{ t('NAV_DEMO') }}
              }
            </button>

            <!-- Admin Login -->
            <a routerLink="/login" 
               class="p-2 text-gray-400 hover:text-tech-blue transition-colors" 
               title="Admin Login">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </a>
          </div>
          
          <!-- Mobile menu button (Simple placeholder) -->
          <div class="-mr-2 flex md:hidden">
             <button type="button" class="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none">
               <span class="sr-only">Open main menu</span>
               <!-- Icon placeholder -->
               <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
               </svg>
             </button>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  langService = inject(LanguageService);
  authService = inject(AuthService);
  adminAuthService = inject(AdminAuthService);
  
  isLoading = false;

  switchLang(lang: string) {
    this.langService.setLanguage(lang);
  }

  loginAsGuest() {
    // NO API CALL - instant demo mode for recruiters
    this.adminAuthService.loginAsGuest();
    this.authService.isAuthenticated.set(true);
    this.authService.currentUser.set({ email: 'guest@demo.com', role: 'GUEST', name: 'Visitante Demo' });
    // Redirect to admin
    window.location.href = '/admin';
  }

  logout() {
    this.authService.logout();
    this.adminAuthService.logout();
  }

  get t() {
    return (key: string) => this.langService.translate(key);
  }
}
