import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

interface StatsData {
  projects: number;
  contacts: number;
  translations: number;
  technologies: number;
}

interface Activity {
  id: string;
  type: 'contact' | 'project' | 'translation';
  messageKey: string;
  messageParams?: any;
  timeKey: string;
  timeParam?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">{{ 'DASH_TITLE' | translate }}</h1>
          <p class="text-gray-400">{{ 'DASH_SUBTITLE' | translate }}</p>
        </div>
        <div class="text-sm text-gray-500">
          {{ 'DASH_LAST_UPDATE' | translate }} {{ lastUpdate }}
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Projects -->
        <div class="p-6 bg-gradient-to-br from-tech-blue/10 to-transparent rounded-2xl border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <span class="text-3xl">📁</span>
            <span class="text-xs text-tech-blue bg-tech-blue/10 px-2 py-1 rounded-full">{{ 'DASH_CARD_NEW_MONTH' | translate }}</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats().projects }}</p>
          <p class="text-gray-400 text-sm">{{ 'DASH_STAT_PROJECTS' | translate }}</p>
        </div>

        <!-- Contacts -->
        <div class="p-6 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <span class="text-3xl">📬</span>
            <span class="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">{{ unreadContacts() }} {{ 'DASH_CARD_NEW_MSG' | translate }}</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats().contacts }}</p>
          <p class="text-gray-400 text-sm">{{ 'DASH_CARD_CONTACTS' | translate }}</p>
        </div>

        <!-- Translations -->
        <div class="p-6 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <span class="text-3xl">🌍</span>
            <span class="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">{{ 'DASH_CARD_LANGUAGES' | translate }}</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats().translations }}</p>
          <p class="text-gray-400 text-sm">{{ 'DASH_CARD_TRANSLATIONS' | translate }}</p>
        </div>

        <!-- Technologies -->
        <div class="p-6 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <span class="text-3xl">⚡</span>
            <span class="text-xs text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full">Stack</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats().technologies }}</p>
          <p class="text-gray-400 text-sm">{{ 'DASH_CARD_TECH' | translate }}</p>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activity -->
        <div class="lg:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-white">{{ 'DASH_ACT_TITLE' | translate }}</h2>
            <button class="text-tech-blue text-sm hover:underline">{{ 'DASH_BTN_VIEW_ALL' | translate }}</button>
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
                  <p class="text-white">{{ activity.messageKey | translate }}</p>
                  <p class="text-gray-500 text-sm">
                    {{ activity.timeKey | translate: { '0': activity.timeParam } }}
                  </p>
                </div>
              </div>
            } @empty {
              <div class="text-center py-8 text-gray-500">
                {{ 'DASH_NO_ACTIVITY' | translate }}
              </div>
            }
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 class="text-lg font-semibold text-white mb-6">{{ 'DASH_QUICK_ACTIONS' | translate }}</h2>
          
          <div class="space-y-3">
            <a routerLink="/admin/projects" 
               class="flex items-center gap-3 p-4 bg-tech-blue/10 rounded-xl text-tech-blue hover:bg-tech-blue/20 transition-colors">
              <span class="text-xl">➕</span>
              <span class="font-medium">{{ 'DASH_ACTION_ADD_PROJECT' | translate }}</span>
            </a>
            
            <a routerLink="/admin/contacts"
               class="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl text-green-400 hover:bg-green-500/20 transition-colors">
              <span class="text-xl">📬</span>
              <span class="font-medium">{{ 'DASH_ACTION_VIEW_CONTACTS' | translate }}</span>
            </a>
            
            <a routerLink="/admin/translations"
               class="flex items-center gap-3 p-4 bg-purple-500/10 rounded-xl text-purple-400 hover:bg-purple-500/20 transition-colors">
              <span class="text-xl">🌍</span>
              <span class="font-medium">{{ 'DASH_ACTION_MANAGE_TRANSLATIONS' | translate }}</span>
            </a>
            
            <a routerLink="/"
               class="flex items-center gap-3 p-4 bg-white/5 rounded-xl text-gray-400 hover:bg-white/10 transition-colors">
              <span class="text-xl">🌐</span>
              <span class="font-medium">{{ 'SIDEBAR_VER_SITE' | translate }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Chart Placeholder -->
      <div class="bg-white/5 rounded-2xl border border-white/10 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white">{{ 'DASH_VISITS' | translate }}</h2>
          <div class="flex gap-2">
            <button (click)="changePeriod(7)" 
                    [class]="period() === 7 ? 'bg-tech-blue/10 text-tech-blue' : 'text-gray-400 hover:bg-white/5'"
                    class="px-3 py-1 text-sm rounded-lg transition-colors">
              <span class="font-bold">7</span> {{ 'DASH_CHART_7D' | translate | slice:2 }}
            </button>
            <button (click)="changePeriod(30)" 
                    [class]="period() === 30 ? 'bg-tech-blue/10 text-tech-blue' : 'text-gray-400 hover:bg-white/5'"
                    class="px-3 py-1 text-sm rounded-lg transition-colors">
              <span class="font-bold">30</span> {{ 'DASH_CHART_30D' | translate | slice:3 }}
            </button>
            <button (click)="changePeriod(90)" 
                    [class]="period() === 90 ? 'bg-tech-blue/10 text-tech-blue' : 'text-gray-400 hover:bg-white/5'"
                    class="px-3 py-1 text-sm rounded-lg transition-colors">
              <span class="font-bold">90</span> {{ 'DASH_CHART_90D' | translate | slice:3 }}
            </button>
          </div>
        </div>
        
        <!-- Simple Chart Placeholder -->
        <div class="h-64 flex items-end gap-2 px-4">
          @for (height of chartData(); track $index) {
            <div class="flex-1 bg-gradient-to-t from-tech-blue/50 to-tech-blue rounded-t-lg transition-all duration-500 hover:from-tech-blue/70"
                 [style.height.%]="height">
            </div>
          }
        </div>
        <div class="flex justify-between mt-2 px-4 text-xs text-gray-500">
          <span>{{ 'DASH_CHART_WEEK_DAYS_MON' | translate }}</span>
          <span>{{ 'DASH_CHART_WEEK_DAYS_TUE' | translate }}</span>
          <span>{{ 'DASH_CHART_WEEK_DAYS_WED' | translate }}</span>
          <span>{{ 'DASH_CHART_WEEK_DAYS_THU' | translate }}</span>
          <span>{{ 'DASH_CHART_WEEK_DAYS_FRI' | translate }}</span>
          <span>{{ 'DASH_CHART_WEEK_DAYS_SAT' | translate }}</span>
          <span>{{ 'DASH_CHART_WEEK_DAYS_SUN' | translate }}</span>
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
    { id: '1', type: 'contact', messageKey: 'DASH_ACT_CONTACT_MSG', timeKey: 'ACT_TIME_HOURS', timeParam: '2' },
    { id: '2', type: 'project', messageKey: 'DASH_ACT_PROJECT_MSG', timeKey: 'ACT_TIME_HOURS', timeParam: '5' },
    { id: '3', type: 'translation', messageKey: 'DASH_ACT_TRANS_MSG', timeKey: 'ACT_TIME_YESTERDAY', timeParam: '1' }
  ]);
  
  period = signal(7);
  chartData = signal([45, 62, 78, 55, 89, 72, 95]);
  
  lastUpdate = new Date().toLocaleString('pt-BR');

  ngOnInit() {
    this.loadStats();
  }
  
  changePeriod(days: number) {
    this.period.set(days);
    // Mock data update - In real app, this would fetch from backend
    const newData = Array.from({length: 7}, () => Math.floor(Math.random() * 80) + 20);
    this.chartData.set(newData);
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
