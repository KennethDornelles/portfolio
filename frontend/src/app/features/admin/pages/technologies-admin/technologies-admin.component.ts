import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AdminAuthService } from '../../../../core/services/admin-auth.service';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { LanguageService } from '../../../../core/services/language.service';

interface Technology {
  id: string;
  name: string;
  category: string;
  icon?: string;
  iconClass?: string;
  proficiencyLevel: number;
}

// Mapping of technology names to devicon classes
const DEVICON_MAP: Record<string, string> = {
  'react': 'devicon-react-original colored',
  'angular': 'devicon-angularjs-plain colored',
  'vue': 'devicon-vuejs-plain colored',
  'vue.js': 'devicon-vuejs-plain colored',
  'nodejs': 'devicon-nodejs-plain colored',
  'node.js': 'devicon-nodejs-plain colored',
  'nestjs': 'devicon-nestjs-original colored',
  'typescript': 'devicon-typescript-plain colored',
  'javascript': 'devicon-javascript-plain colored',
  'python': 'devicon-python-plain colored',
  'docker': 'devicon-docker-plain colored',
  'kubernetes': 'devicon-kubernetes-plain colored',
  'postgresql': 'devicon-postgresql-plain colored',
  'mysql': 'devicon-mysql-plain colored',
  'mongodb': 'devicon-mongodb-plain colored',
  'redis': 'devicon-redis-plain colored',
  'git': 'devicon-git-plain colored',
  'github': 'devicon-github-original colored',
  'aws': 'devicon-amazonwebservices-plain-wordmark colored',
  'azure': 'devicon-azure-plain colored',
  'gcp': 'devicon-googlecloud-plain colored',
  'tailwindcss': 'devicon-tailwindcss-plain colored',
  'sass': 'devicon-sass-original colored',
  'prisma': 'devicon-prisma-original colored',
  'graphql': 'devicon-graphql-plain colored',
  'express': 'devicon-express-original colored',
  'nextjs': 'devicon-nextjs-original colored',
  'next.js': 'devicon-nextjs-original colored',
  'flutter': 'devicon-flutter-plain colored',
  'html5': 'devicon-html5-plain colored',
  'css3': 'devicon-css3-plain colored',
  'java': 'devicon-java-plain colored',
  'spring': 'devicon-spring-plain colored',
  'linux': 'devicon-linux-plain colored',
  'nginx': 'devicon-nginx-original colored',
  'jest': 'devicon-jest-plain colored',
  'webpack': 'devicon-webpack-plain colored',
  'vscode': 'devicon-vscode-plain colored',
  'figma': 'devicon-figma-plain colored',
};

@Component({
  selector: 'app-technologies-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">{{ 'ADMIN_TECH_TITLE' | translate }}</h1>
          <p class="text-gray-400">{{ 'ADMIN_TECH_SUBTITLE' | translate }}</p>
        </div>
        @if (adminAuth.canEdit()) {
          <button (click)="showModal = true; editingTech = null; resetForm()"
                  class="px-4 py-2 bg-tech-blue text-black font-medium rounded-xl hover:bg-tech-blue/80 transition-colors">
            {{ 'ADMIN_BTN_NEW_TECH' | translate }}
          </button>
        } @else {
          <span class="px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-xl text-sm">
            👁️ {{ 'ADMIN_VIEW_MODE' | translate }}
          </span>
        }
      </div>

      <!-- Categories Filter -->
      <div class="flex gap-2 flex-wrap">
        <button (click)="selectedCategory = ''"
                [class]="!selectedCategory ? 'bg-tech-blue text-black' : 'bg-white/5 text-gray-400'"
                class="px-4 py-2 rounded-xl font-medium transition-colors">
          {{ 'ADMIN_TECH_ALL' | translate }}
        </button>
        @for (cat of categories(); track cat) {
          <button (click)="selectedCategory = cat"
                  [class]="selectedCategory === cat ? 'bg-tech-blue text-black' : 'bg-white/5 text-gray-400'"
                  class="px-4 py-2 rounded-xl font-medium transition-colors">
            {{ cat }}
          </button>
        }
      </div>

      <!-- Technologies Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (tech of filteredTechnologies(); track tech.id) {
          <div class="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-tech-blue/30 transition-all group">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <i [class]="getIconClass(tech)" class="text-3xl"></i>
                <div>
                  <h3 class="text-white font-semibold">{{ tech.name }}</h3>
                  <span class="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">{{ tech.category }}</span>
                </div>
              </div>
              @if (adminAuth.canEdit()) {
                <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button (click)="editTech(tech)"
                          class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    ✏️
                  </button>
                  <button (click)="deleteTech(tech.id)"
                          class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    🗑️
                  </button>
                </div>
              }
            </div>
            
            <!-- Proficiency Bar -->
            <div class="mt-4">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-400">{{ 'ADMIN_TECH_PROFICIENCY' | translate }}</span>
                <span class="text-tech-blue font-medium">{{ tech.proficiencyLevel }}%</span>
              </div>
              <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-tech-blue to-purple-500 rounded-full transition-all"
                     [style.width.%]="tech.proficiencyLevel"></div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
            <span class="text-4xl mb-4 block">⚡</span>
            <p class="text-gray-400">{{ 'ADMIN_TECH_EMPTY' | translate }}</p>
          </div>
        }
      </div>

      <!-- Modal (admin only) -->
      @if (showModal && adminAuth.canEdit()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-graphite-900 rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
            <h2 class="text-xl font-bold text-white mb-6">
              {{ (editingTech ? 'ADMIN_TECH_MODAL_EDIT' : 'ADMIN_TECH_MODAL_NEW') | translate }}
            </h2>
            
            <form (submit)="saveTech($event)" class="space-y-4">
              <div>
                <label class="block text-gray-400 text-sm mb-2">{{ 'ADMIN_FORM_NAME' | translate }}</label>
                <input type="text" [(ngModel)]="form.name" name="name" required
                       class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50">
              </div>
              
              <div>
                <label class="block text-gray-400 text-sm mb-2">{{ 'ADMIN_FORM_CATEGORY' | translate }}</label>
                <select [(ngModel)]="form.category" name="category" required
                        class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-tech-blue/50">
                  <option value="">{{ 'ADMIN_FORM_SELECT' | translate }}</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Other">{{ 'ADMIN_FORM_OTHER' | translate }}</option>
                </select>
              </div>
              
              <div>
                <label class="block text-gray-400 text-sm mb-2">{{ 'ADMIN_FORM_ICON' | translate }}</label>
                <input type="text" [(ngModel)]="form.icon" name="icon"
                       placeholder="⚡"
                       class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50 text-center text-2xl">
              </div>
              
              <div>
                <label class="block text-gray-400 text-sm mb-2">{{ 'ADMIN_TECH_PROFICIENCY' | translate }}: {{ form.proficiencyLevel }}%</label>
                <input type="range" [(ngModel)]="form.proficiencyLevel" name="proficiencyLevel"
                       min="0" max="100" step="5"
                       class="w-full accent-tech-blue">
              </div>
              
              <div class="flex gap-3 pt-4">
                <button type="button" (click)="showModal = false"
                        class="flex-1 px-4 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors">
                  {{ 'ADMIN_BTN_CANCEL' | translate }}
                </button>
                <button type="submit" [disabled]="loading()"
                        class="flex-1 px-4 py-3 bg-tech-blue text-black font-medium rounded-xl hover:bg-tech-blue/80 transition-colors disabled:opacity-50">
                  {{ loading() ? ('ADMIN_BTN_SAVING' | translate) : ('ADMIN_BTN_SAVE' | translate) }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class TechnologiesAdminComponent implements OnInit {
  private http = inject(HttpClient);
  private i18n = inject(LanguageService);
  adminAuth = inject(AdminAuthService);
  
  technologies = signal<Technology[]>([]);
  loading = signal(false);
  showModal = false;
  editingTech: Technology | null = null;
  selectedCategory = '';
  
  form = {
    name: '',
    category: '',
    icon: '',
    proficiencyLevel: 75
  };

  ngOnInit() {
    this.loadTechnologies();
  }

  loadTechnologies() {
    this.http.get<Technology[]>(`${environment.apiUrl}/technologies`).subscribe({
      next: (data) => this.technologies.set(data),
      error: (err) => console.error('Failed to load technologies', err)
    });
  }

  categories() {
    return [...new Set(this.technologies().map(t => t.category))];
  }

  filteredTechnologies() {
    if (!this.selectedCategory) return this.technologies();
    return this.technologies().filter(t => t.category === this.selectedCategory);
  }

  resetForm() {
    this.form = {
      name: '',
      category: '',
      icon: '',
      proficiencyLevel: 75
    };
  }

  editTech(tech: Technology) {
    if (!this.adminAuth.canEdit()) return;
    this.editingTech = tech;
    this.form = {
      name: tech.name,
      category: tech.category,
      icon: tech.icon || '',
      proficiencyLevel: tech.proficiencyLevel
    };
    this.showModal = true;
  }

  saveTech(event: Event) {
    event.preventDefault();
    if (!this.adminAuth.canEdit()) return;
    this.loading.set(true);

    const payload = {
      name: this.form.name,
      category: this.form.category,
      icon: this.form.icon || null,
      proficiencyLevel: this.form.proficiencyLevel
    };

    const request = this.editingTech
      ? this.http.put(`${environment.apiUrl}/technologies/${this.editingTech.id}`, payload)
      : this.http.post(`${environment.apiUrl}/technologies`, payload);

    request.subscribe({
      next: () => {
        this.loadTechnologies();
        this.showModal = false;
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to save technology', err);
        this.loading.set(false);
      }
    });
  }

  deleteTech(id: string) {
    if (!this.adminAuth.canEdit()) return;
    if (confirm(this.i18n.translate('ADMIN_CONFIRM_DELETE_TECH'))) {
      this.http.delete(`${environment.apiUrl}/technologies/${id}`).subscribe({
        next: () => this.loadTechnologies(),
        error: (err: any) => console.error('Failed to delete technology', err)
      });
    }
  }

  getIconClass(tech: Technology): string {
    // Priority: iconClass from DB > lookup by name > fallback
    if (tech.iconClass) {
      return tech.iconClass;
    }
    
    const normalizedName = tech.name.toLowerCase().replace(/\s/g, '').replace(/\./g, '');
    return DEVICON_MAP[normalizedName] || DEVICON_MAP[tech.name.toLowerCase()] || 'devicon-devicon-plain colored';
  }
}
