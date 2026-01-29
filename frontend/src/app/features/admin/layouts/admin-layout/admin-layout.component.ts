import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TranslatePipe],
  template: `
    <div class="min-h-screen bg-graphite-900 flex">
      <!-- Sidebar -->
      <app-sidebar />

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <header class="h-16 bg-graphite-950 border-b border-white/10 flex items-center justify-between px-6">
          <div class="flex items-center gap-4">
            <h1 class="text-white font-semibold text-lg">{{ 'ADMIN_PANEL_TITLE' | translate }}</h1>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Search -->
            <div class="relative">
              <input type="text" 
                     [placeholder]="'ADMIN_SEARCH_PLACEHOLDER' | translate" 
                     class="w-64 px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50 transition-colors">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>

            <!-- Notifications -->
            <button class="relative p-2 text-gray-400 hover:text-white transition-colors">
              <span class="text-xl">🔔</span>
              <span class="absolute top-1 right-1 w-2 h-2 bg-tech-blue rounded-full"></span>
            </button>

            <!-- Quick Actions -->
            <button class="px-4 py-2 bg-tech-blue text-black font-medium rounded-xl hover:bg-tech-blue/80 transition-colors">
              {{ 'ADMIN_BTN_NEW' | translate }}
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-6 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {}
