import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface StatsData {
  projects: number;
  contacts: number;
  translations: number;
  technologies: number;
}

interface Activity {
  id: string;
  type: 'contact' | 'project' | 'translation';
  message: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Dashboard</h1>
          <p class="text-gray-400">Visão geral do seu portfolio</p>
        </div>
        <div class="text-sm text-gray-500">
          Última atualização: {{ lastUpdate }}
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Projects -->
        <div class="p-6 bg-gradient-to-br from-tech-blue/10 to-transparent rounded-2xl border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <span class="text-3xl">📁</span>
            <span class="text-xs text-tech-blue bg-tech-blue/10 px-2 py-1 rounded-full">+2 este mês</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats().projects }}</p>
          <p class="text-gray-400 text-sm">Projetos</p>
        </div>

        <!-- Contacts -->
        <div class="p-6 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <span class="text-3xl">📬</span>
            <span class="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">{{ unreadContacts() }} novos</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats().contacts }}</p>
          <p class="text-gray-400 text-sm">Contatos</p>
        </div>

        <!-- Translations -->
        <div class="p-6 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <span class="text-3xl">🌍</span>
            <span class="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">2 idiomas</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats().translations }}</p>
          <p class="text-gray-400 text-sm">Traduções</p>
        </div>

        <!-- Technologies -->
        <div class="p-6 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <span class="text-3xl">⚡</span>
            <span class="text-xs text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full">Stack</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats().technologies }}</p>
          <p class="text-gray-400 text-sm">Tecnologias</p>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activity -->
        <div class="lg:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-white">Atividade Recente</h2>
            <button class="text-tech-blue text-sm hover:underline">Ver tudo</button>
          </div>
          
          <div class="space-y-4">
            @for (activity of activities(); track activity.id) {
              <div class="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                <span class="text-2xl">
                  @switch (activity.type) {
                    @case ('contact') { 📬 }
                    @case ('project') { 📁 }
                    @case ('translation') { 🌍 }
                  }
                </span>
                <div class="flex-1">
                  <p class="text-white">{{ activity.message }}</p>
                  <p class="text-gray-500 text-sm">{{ activity.time }}</p>
                </div>
              </div>
            } @empty {
              <div class="text-center py-8 text-gray-500">
                Nenhuma atividade recente
              </div>
            }
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 class="text-lg font-semibold text-white mb-6">Ações Rápidas</h2>
          
          <div class="space-y-3">
            <a routerLink="/admin/projects" 
               class="flex items-center gap-3 p-4 bg-tech-blue/10 rounded-xl text-tech-blue hover:bg-tech-blue/20 transition-colors">
              <span class="text-xl">➕</span>
              <span class="font-medium">Adicionar Projeto</span>
            </a>
            
            <a routerLink="/admin/contacts"
               class="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl text-green-400 hover:bg-green-500/20 transition-colors">
              <span class="text-xl">📬</span>
              <span class="font-medium">Ver Contatos</span>
            </a>
            
            <a routerLink="/admin/translations"
               class="flex items-center gap-3 p-4 bg-purple-500/10 rounded-xl text-purple-400 hover:bg-purple-500/20 transition-colors">
              <span class="text-xl">🌍</span>
              <span class="font-medium">Gerenciar Traduções</span>
            </a>
            
            <a routerLink="/"
               class="flex items-center gap-3 p-4 bg-white/5 rounded-xl text-gray-400 hover:bg-white/10 transition-colors">
              <span class="text-xl">🌐</span>
              <span class="font-medium">Visualizar Site</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Chart Placeholder -->
      <div class="bg-white/5 rounded-2xl border border-white/10 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white">Visitas do Portfolio</h2>
          <div class="flex gap-2">
            <button class="px-3 py-1 text-sm bg-tech-blue/10 text-tech-blue rounded-lg">7 dias</button>
            <button class="px-3 py-1 text-sm text-gray-400 hover:bg-white/5 rounded-lg">30 dias</button>
            <button class="px-3 py-1 text-sm text-gray-400 hover:bg-white/5 rounded-lg">90 dias</button>
          </div>
        </div>
        
        <!-- Simple Chart Placeholder -->
        <div class="h-64 flex items-end gap-2 px-4">
          @for (height of chartData; track $index) {
            <div class="flex-1 bg-gradient-to-t from-tech-blue/50 to-tech-blue rounded-t-lg transition-all hover:from-tech-blue/70"
                 [style.height.%]="height">
            </div>
          }
        </div>
        <div class="flex justify-between mt-2 px-4 text-xs text-gray-500">
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sáb</span>
          <span>Dom</span>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  
  stats = signal<StatsData>({
    projects: 2,
    contacts: 5,
    translations: 88,
    technologies: 8
  });
  
  unreadContacts = signal(3);
  
  activities = signal<Activity[]>([
    { id: '1', type: 'contact', message: 'Novo contato recebido de João Silva', time: 'Há 2 horas' },
    { id: '2', type: 'project', message: 'Projeto BarberBoss atualizado', time: 'Há 5 horas' },
    { id: '3', type: 'translation', message: '15 novas chaves de tradução adicionadas', time: 'Ontem' }
  ]);
  
  chartData = [45, 62, 78, 55, 89, 72, 95];
  
  lastUpdate = new Date().toLocaleString('pt-BR');

  ngOnInit() {
    this.loadStats();
  }

  private loadStats() {
    // Load real stats from API
    this.http.get<any[]>(`${environment.apiUrl}/projects`).subscribe({
      next: (projects) => {
        this.stats.update(s => ({ ...s, projects: projects.length }));
      }
    });

    this.http.get<any[]>(`${environment.apiUrl}/contacts`).subscribe({
      next: (contacts) => {
        this.stats.update(s => ({ ...s, contacts: contacts.length }));
        this.unreadContacts.set(contacts.filter((c: any) => !c.read).length);
      }
    });

    this.http.get<any[]>(`${environment.apiUrl}/technologies`).subscribe({
      next: (techs) => {
        this.stats.update(s => ({ ...s, technologies: techs.length }));
      }
    });
  }
}
