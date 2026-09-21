import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { SocialLinksComponent } from '../social-links/social-links.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    NavbarComponent,
    SocialLinksComponent,
    TranslatePipe,
  ],
  template: `
    <div class="min-h-screen bg-graphite-950 text-white font-sans selection:bg-tech-blue/30">
      <a class="skip-link" href="#main-content">Pular para o conteúdo principal</a>
      <app-navbar></app-navbar>

      <main id="main-content" class="relative pt-16" tabindex="-1">
        <!-- Background Gradients/Effects could go here -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div
            class="absolute top-0 left-1/4 w-96 h-96 bg-tech-blue/10 rounded-full blur-3xl opacity-20 transform -translate-y-1/2"
          ></div>
          <div
            class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-20 transform translate-y-1/2"
          ></div>
        </div>

        @if (currentRoute() !== '/') {
          <nav
            aria-label="Navegação contextual"
            class="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8"
          >
            <ol class="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <a routerLink="/" class="hover:text-tech-blue">{{ 'NAV_HOME' | translate }}</a>
              </li>
              <li aria-hidden="true">/</li>
              <li class="text-gray-300" aria-current="page">{{ currentLabel() | translate }}</li>
            </ol>
          </nav>
        }
        <router-outlet></router-outlet>
      </main>

      <!-- Footer Placeholder -->
      <footer class="border-t border-white/5 px-4 py-12 text-center text-gray-500 text-sm">
        <div class="mx-auto max-w-6xl space-y-6">
          <p>&copy; 2026 OluStack. Built with Angular 21 &amp; NestJS.</p>
          <app-social-links />
        </div>
      </footer>
    </div>
  `,
})
export class MainLayoutComponent {
  private readonly router = inject(Router);
  readonly currentRoute = signal(this.normalize(this.router.url));

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentRoute.set(this.normalize(event.urlAfterRedirects)));
  }

  currentLabel(): string {
    const labels: Record<string, string> = {
      '/projects': 'NAV_PROJECTS',
      '/timeline': 'NAV_EXPERIENCE',
      '/services': 'NAV_SERVICES',
      '/about': 'NAV_ABOUT',
      '/contact': 'CONTACT_TITLE',
    };
    return labels[this.currentRoute()] || 'NAV_HOME';
  }

  private normalize(url: string): string {
    return url.split('?')[0].split('#')[0] || '/';
  }
}
