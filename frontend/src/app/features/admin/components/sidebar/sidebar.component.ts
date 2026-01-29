import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAuthService } from '../../../../core/services/admin-auth.service';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

interface NavItem {
  icon: string;
  labelKey: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe],
  template: `
    <aside class="w-64 min-h-screen bg-graphite-950 border-r border-white/10 flex flex-col">
      <!-- Logo -->
      <div class="p-6 border-b border-white/10">
        <a routerLink="/" class="flex items-center gap-3">
          <img src="assets/avatar.svg" alt="OluStack" class="w-10 h-10 rounded-full">
          <div>
            <span class="text-white font-bold text-lg">OluStack</span>
            <span class="block text-xs text-gray-500">{{ 'ADMIN_PANEL_TITLE' | translate }}</span>
          </div>
        </a>
      </div>

      <!-- Role Badge -->
      @if (adminAuth.isGuest()) {
        <div class="mx-4 mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
          <span class="text-yellow-400 text-sm">👁️ {{ 'SIDEBAR_DEMO_MODE' | translate }}</span>
        </div>
      }

      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <ul class="space-y-1">
          @for (item of navItems; track item.route) {
            <li>
              <a [routerLink]="item.route" 
                 routerLinkActive="bg-tech-blue/10 text-tech-blue border-tech-blue"
                 [routerLinkActiveOptions]="{ exact: item.route === '/admin/dashboard' }"
                 class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-transparent">
                <span class="text-xl">{{ item.icon }}</span>
                <span class="font-medium">{{ item.labelKey | translate }}</span>
              </a>
            </li>
          }
        </ul>

        <!-- Divider -->
        <div class="my-6 border-t border-white/10"></div>

        <!-- Secondary Nav -->
        <ul class="space-y-1">
          <li>
            <a routerLink="/" 
               class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <span class="text-xl">🌐</span>
              <span class="font-medium">{{ 'SIDEBAR_VER_SITE' | translate }}</span>
            </a>
          </li>
          <li>
            <button (click)="logout()"
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
              <span class="text-xl">🚪</span>
              <span class="font-medium">{{ 'SIDEBAR_LOGOUT' | translate }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- User Info -->
      <div class="p-4 border-t border-white/10">
        <div class="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
          <img src="assets/avatar.svg" alt="Admin" class="w-10 h-10 rounded-full">
          <div class="flex-1 min-w-0">
            <p class="text-white font-medium text-sm truncate">{{ adminAuth.user()?.name || ('ROLE_GUEST' | translate) }}</p>
            <p class="text-xs truncate" 
               [class]="adminAuth.isAdmin() ? 'text-tech-blue' : 'text-yellow-400'">
              {{ (adminAuth.isAdmin() ? 'ROLE_ADMIN' : 'ROLE_GUEST_DEMO') | translate }}
            </p>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  adminAuth = inject(AdminAuthService);
  
  navItems: NavItem[] = [
    { icon: '📊', labelKey: 'SIDEBAR_DASHBOARD', route: '/admin/dashboard' },
    { icon: '📁', labelKey: 'SIDEBAR_PROJECTS', route: '/admin/projects' },
    { icon: '📬', labelKey: 'SIDEBAR_CONTACTS', route: '/admin/contacts' },
    { icon: '🌍', labelKey: 'SIDEBAR_TRANSLATIONS', route: '/admin/translations' },
    { icon: '⚡', labelKey: 'SIDEBAR_TECHNOLOGIES', route: '/admin/technologies' }
  ];

  logout() {
    this.adminAuth.logout();
    window.location.href = '/';
  }
}
