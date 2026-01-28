import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminAuthService } from '../../core/services/admin-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-graphite-900 flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-block">
            <span class="text-3xl font-bold tracking-tighter text-white">
              Olu<span class="text-tech-blue">Stack</span><span class="text-tech-blue">.</span>
            </span>
          </a>
          <p class="text-gray-400 mt-2">Acesso Administrativo</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white/5 rounded-2xl border border-white/10 p-8">
          <h1 class="text-2xl font-bold text-white mb-6">Login</h1>
          
          @if (error()) {
            <div class="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {{ error() }}
            </div>
          }

          <form (submit)="handleLogin($event)" class="space-y-4">
            <div>
              <label class="block text-gray-400 text-sm mb-2">Email</label>
              <input type="email" [(ngModel)]="email" name="email" required
                     placeholder="admin@olustack.com"
                     class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50 transition-colors">
            </div>
            
            <div>
              <label class="block text-gray-400 text-sm mb-2">Senha</label>
              <input type="password" [(ngModel)]="password" name="password" required
                     placeholder="••••••••"
                     class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50 transition-colors">
            </div>

            <button type="submit" [disabled]="loading()"
                    class="w-full py-3 bg-tech-blue text-black font-bold rounded-xl hover:bg-tech-blue/80 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              @if (loading()) {
                <span class="animate-spin h-4 w-4 border-2 border-black/30 border-t-black rounded-full"></span>
                Entrando...
              } @else {
                Entrar
              }
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-white/10 text-center">
            <p class="text-gray-400 text-sm">
              Não tem conta? 
              <a routerLink="/register" class="text-tech-blue hover:text-tech-blue/80 transition-colors">
                Criar conta
              </a>
            </p>
          </div>
        </div>

        <div class="mt-6 text-center">
          <a routerLink="/" class="text-gray-500 hover:text-white text-sm transition-colors">
            ← Voltar ao site
          </a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private adminAuth = inject(AdminAuthService);
  
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  handleLogin(event: Event) {
    event.preventDefault();
    this.loading.set(true);
    this.error.set('');

    // Authenticate via backend API
    this.http.post<{ accessToken: string; user: any }>(`${environment.apiUrl}/auth/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.adminAuth.login(res.accessToken, res.user);
        this.loading.set(false);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Email ou senha inválidos');
      }
    });
  }
}
