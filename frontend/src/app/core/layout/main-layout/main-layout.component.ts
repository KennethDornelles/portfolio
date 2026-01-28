import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-graphite-950 text-white font-sans selection:bg-tech-blue/30">
      <app-navbar></app-navbar>
      
      <main class="relative pt-16">
        <!-- Background Gradients/Effects could go here -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
           <div class="absolute top-0 left-1/4 w-96 h-96 bg-tech-blue/10 rounded-full blur-3xl opacity-20 transform -translate-y-1/2"></div>
           <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-20 transform translate-y-1/2"></div>
        </div>

        <router-outlet></router-outlet>
      </main>

      <!-- Footer Placeholder -->
      <footer class="border-t border-white/5 py-12 text-center text-gray-500 text-sm">
        <p>&copy; 2026 OluStack. Built with Angular 21 &amp; NestJS.</p>
      </footer>
    </div>
  `
})
export class MainLayoutComponent {}
