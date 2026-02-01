import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TranslatePipe],
  template: `
    <div class="min-h-screen bg-graphite-900 flex relative">
      <!-- Mobile Menu Button -->
      <button (click)="toggleSidebar()"
              class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-graphite-950 border border-white/10 rounded-xl text-white">
        <span class="text-2xl">{{ sidebarOpen() ? '✕' : '☰' }}</span>
      </button>

      <!-- Mobile Overlay -->
      @if (sidebarOpen()) {
        <div class="lg:hidden fixed inset-0 bg-black/50 z-30"
             (click)="toggleSidebar()"></div>
      }

      <!-- Sidebar -->
      <div class="fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300"
           [class.translate-x-0]="sidebarOpen()"
           [class.-translate-x-full]="!sidebarOpen()"
           [class.lg:translate-x-0]="true">
        <app-sidebar (closeSidebar)="closeSidebar()" />
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col w-full">
        <!-- Header -->
        <header class="h-16 bg-graphite-950 border-b border-white/10 flex items-center justify-between px-4 lg:px-6">
          <div class="flex items-center gap-4 pl-12 lg:pl-0">
            <h1 class="text-white font-semibold text-base lg:text-lg">{{ 'ADMIN_PANEL_TITLE' | translate }}</h1>
          </div>

          <div class="flex items-center gap-2 lg:gap-4">
            <!-- Search (hidden on mobile) -->
            <div class="relative hidden md:block">
              <input type="text"
                     [placeholder]="'ADMIN_SEARCH_PLACEHOLDER' | translate"
                     class="w-32 lg:w-64 px-3 py-2 pl-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-tech-blue/50 transition-colors">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            </div>

            <!-- Notifications -->
            <button class="relative p-2 text-gray-400 hover:text-white transition-colors">
              <span class="text-lg lg:text-xl">🔔</span>
              <span class="absolute top-1 right-1 w-2 h-2 bg-tech-blue rounded-full"></span>
            </button>

            <!-- Quick Actions (hidden on small mobile) -->
            <button class="hidden sm:block px-3 lg:px-4 py-2 bg-tech-blue text-black text-sm font-medium rounded-xl hover:bg-tech-blue/80 transition-colors">
              {{ 'ADMIN_BTN_NEW' | translate }}
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-4 lg:p-6 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
