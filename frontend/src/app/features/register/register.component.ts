import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
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
          <p class="text-gray-400 mt-2">Criar Conta</p>
        </div>

        <!-- Register Card -->
        <div class="bg-white/5 rounded-2xl border border-white/10 p-8">
          <h1 class="text-2xl font-bold text-white mb-6">Cadastro</h1>
          
          @if (error()) {
            <div class="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {{ error() }}
            </div>
          }

          @if (success()) {
            <div class="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
              {{ success() }}
            </div>
          }

          <form (submit)="handleRegister($event)" class="space-y-4">
            <div>
              <label class="block text-gray-400 text-sm mb-2">Nome Completo</label>
              <input type="text" [(ngModel)]="name" name="name" required
                     placeholder="Seu nome"
                     class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50 transition-colors">
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Email</label>
              <input type="email" [(ngModel)]="email" name="email" required
                     placeholder="seu@email.com"
                     class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50 transition-colors">
            </div>
            
            <div>
              <label class="block text-gray-400 text-sm mb-2">Senha</label>
              <input type="password" [(ngModel)]="password" name="password" required minlength="6"
                     placeholder="Mínimo 6 caracteres"
                     class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50 transition-colors">
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">Confirmar Senha</label>
              <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required
                     placeholder="Repita a senha"
                     class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50 transition-colors">
            </div>

            <button type="submit" [disabled]="loading()"
                    class="w-full py-3 bg-tech-blue text-black font-bold rounded-xl hover:bg-tech-blue/80 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              @if (loading()) {
                <span class="animate-spin h-4 w-4 border-2 border-black/30 border-t-black rounded-full"></span>
                Criando conta...
              } @else {
                Criar Conta
              }
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-white/10 text-center">
            <p class="text-gray-400 text-sm">
              Já tem uma conta? 
              <a routerLink="/login" class="text-tech-blue hover:text-tech-blue/80 transition-colors">
                Entrar
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
export class RegisterComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal('');
  success = signal('');

  handleRegister(event: Event) {
    event.preventDefault();
    this.error.set('');
    this.success.set('');

    // Validations
    if (this.password !== this.confirmPassword) {
      this.error.set('As senhas não coincidem');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    this.loading.set(true);

    this.http.post<{ message: string }>(`${environment.apiUrl}/auth/register`, {
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erro ao criar conta. Tente novamente.');
      }
    });
  }
}
