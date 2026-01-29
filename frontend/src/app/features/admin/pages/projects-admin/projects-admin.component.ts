import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AdminAuthService } from '../../../../core/services/admin-auth.service';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { LanguageService } from '../../../../core/services/language.service';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  technologies: any[];
  repositoryUrl?: string;
  liveUrl?: string;
  isActive: boolean;
  createdAt: string;
}

interface Technology {
  id: string;
  name: string;
}

@Component({
  selector: 'app-projects-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">{{ 'ADMIN_PROJECTS_TITLE' | translate }}</h1>
          <p class="text-gray-400">{{ 'ADMIN_PROJECTS_SUBTITLE' | translate }}</p>
        </div>
        @if (adminAuth.canEdit()) {
          <button (click)="showModal = true; editingProject = null; resetForm()"
                  class="px-4 py-2 bg-tech-blue text-black font-medium rounded-xl hover:bg-tech-blue/80 transition-colors">
            {{ 'ADMIN_BTN_NEW_PROJECT' | translate }}
          </button>
        } @else {
          <span class="px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-xl text-sm">
            👁️ {{ 'ADMIN_VIEW_MODE' | translate }}
          </span>
        }
      </div>

      <!-- Projects Table -->
      <div class="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <table class="w-full">
          <thead class="bg-white/5">
            <tr>
              <th class="text-left px-6 py-4 text-gray-400 font-medium text-sm">{{ 'ADMIN_TBL_NAME' | translate }}</th>
              <th class="text-left px-6 py-4 text-gray-400 font-medium text-sm">{{ 'ADMIN_TBL_TECHNOLOGIES' | translate }}</th>
              <th class="text-left px-6 py-4 text-gray-400 font-medium text-sm">{{ 'ADMIN_TBL_STATUS' | translate }}</th>
              <th class="text-left px-6 py-4 text-gray-400 font-medium text-sm">{{ 'ADMIN_TBL_DATE' | translate }}</th>
              @if (adminAuth.canEdit()) {
                <th class="text-right px-6 py-4 text-gray-400 font-medium text-sm">{{ 'ADMIN_TBL_ACTIONS' | translate }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (project of projects(); track project.id) {
              <tr class="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">📁</span>
                    <div>
                      <p class="text-white font-medium">{{ project.title }}</p>
                      <p class="text-gray-500 text-sm truncate max-w-xs">{{ project.description }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    @for (tech of project.technologies.slice(0, 3); track tech.id) {
                      <span class="px-2 py-0.5 bg-tech-blue/10 text-tech-blue text-xs rounded-full">{{ tech.name }}</span>
                    }
                    @if (project.technologies.length > 3) {
                      <span class="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-full">+{{ project.technologies.length - 3 }}</span>
                    }
                  </div>
                </td>
                <td class="px-6 py-4">
                  @if (project.isActive) {
                    <span class="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">{{ 'ADMIN_STATUS_ACTIVE' | translate }}</span>
                  } @else {
                    <span class="px-3 py-1 bg-gray-500/10 text-gray-400 text-xs rounded-full">{{ 'ADMIN_STATUS_INACTIVE' | translate }}</span>
                  }
                </td>
                <td class="px-6 py-4 text-gray-400 text-sm">
                  {{ project.createdAt | date:'dd/MM/yyyy' }}
                </td>
                @if (adminAuth.canEdit()) {
                  <td class="px-6 py-4">
                    <div class="flex justify-end gap-2">
                      <button (click)="editProject(project)" 
                              class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        ✏️
                      </button>
                      <button (click)="deleteProject(project.id)"
                              class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        🗑️
                      </button>
                    </div>
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="adminAuth.canEdit() ? 5 : 4" class="px-6 py-12 text-center text-gray-500">
                  {{ 'ADMIN_PROJECTS_EMPTY' | translate }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modal (only for admin) -->
      @if (showModal && adminAuth.canEdit()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-graphite-900 rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
            <h2 class="text-xl font-bold text-white mb-6">
              {{ (editingProject ? 'ADMIN_PROJECTS_MODAL_EDIT' : 'ADMIN_PROJECTS_MODAL_NEW') | translate }}
            </h2>
            
            <form (submit)="saveProject($event)" class="space-y-4">
              @if (errorMessage()) {
                <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {{ errorMessage() }}
                </div>
              }
              <div>
                <label class="block text-gray-400 text-sm mb-2">{{ 'ADMIN_FORM_TITLE' | translate }}</label>
                <input type="text" [(ngModel)]="form.title" name="title" required
                       class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50">
              </div>
              
              <div>
                <label class="block text-gray-400 text-sm mb-2">{{ 'ADMIN_FORM_DESCRIPTION' | translate }}</label>
                <textarea [(ngModel)]="form.description" name="description" rows="3"
                          class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50 resize-none"></textarea>
              </div>
              
              <div>
                <label class="block text-gray-400 text-sm mb-2">{{ 'ADMIN_FORM_TECH_HINT' | translate }}</label>
                <input type="text" [(ngModel)]="form.technologiesStr" name="technologies"
                       class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50"
                       placeholder="React, Node.js, PostgreSQL">
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-400 text-sm mb-2">GitHub URL</label>
                  <input type="url" [(ngModel)]="form.repositoryUrl" name="repositoryUrl"
                         class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50">
                </div>
                <div>
                  <label class="block text-gray-400 text-sm mb-2">Live URL</label>
                  <input type="url" [(ngModel)]="form.liveUrl" name="liveUrl"
                         class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50">
                </div>
              </div>
              
              <div class="flex items-center gap-3">
                <input type="checkbox" [(ngModel)]="form.isActive" name="isActive" id="isActive"
                       class="w-5 h-5 rounded bg-white/5 border-white/10">
                <label for="isActive" class="text-gray-300">{{ 'ADMIN_FORM_PROJECT_ACTIVE' | translate }}</label>
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
export class ProjectsAdminComponent implements OnInit {
  private http = inject(HttpClient);
  private i18n = inject(LanguageService);
  adminAuth = inject(AdminAuthService);
  
  projects = signal<Project[]>([]);
  availableTechnologies = signal<Technology[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showModal = false;
  editingProject: Project | null = null;
  
  form = {
    title: '',
    description: '',
    technologiesStr: '',
    repositoryUrl: '',
    liveUrl: '',
    isActive: true
  };

  ngOnInit() {
    this.loadProjects();
    this.loadTechnologies();
  }

  loadProjects() {
    this.http.get<Project[]>(`${environment.apiUrl}/projects`).subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => console.error('Failed to load projects', err)
    });
  }

  loadTechnologies() {
    this.http.get<Technology[]>(`${environment.apiUrl}/technologies`).subscribe({
      next: (data) => this.availableTechnologies.set(data),
      error: (err) => console.error('Failed to load technologies', err)
    });
  }

  resetForm() {
    this.errorMessage.set(null);
    this.form = {
      title: '',
      description: '',
      technologiesStr: '',
      repositoryUrl: '',
      liveUrl: '',
      isActive: true
    };
  }

  editProject(project: Project) {
    if (!this.adminAuth.canEdit()) return;
    this.editingProject = project;
    this.form = {
      title: project.title,
      description: project.description,
      technologiesStr: project.technologies.map(t => t.name).join(', '),
      repositoryUrl: project.repositoryUrl || '',
      liveUrl: project.liveUrl || '',
      isActive: project.isActive
    };
    this.showModal = true;
  }

  saveProject(event: Event) {
    event.preventDefault();
    if (!this.adminAuth.canEdit()) return;
    this.loading.set(true);

    // Map technology names to IDs
    const techNames = this.form.technologiesStr.split(',').map(t => t.trim()).filter(t => t);
    const technologyIds = techNames.map(name => {
      const tech = this.availableTechnologies().find(t => t.name.toLowerCase() === name.toLowerCase());
      return tech ? tech.id : null;
    }).filter(t => t) as string[];

    const payload = {
      title: this.form.title,
      slug: this.form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      description: this.form.description,
      technologyIds,
      repositoryUrl: this.form.repositoryUrl || null,
      liveUrl: this.form.liveUrl || null,
      isActive: this.form.isActive
    };

    const request = this.editingProject
      ? this.http.put(`${environment.apiUrl}/projects/${this.editingProject.id}`, payload)
      : this.http.post(`${environment.apiUrl}/projects`, payload);

    request.subscribe({
      next: () => {
        this.loadProjects();
        this.showModal = false;
        this.loading.set(false);
        this.errorMessage.set(null);
      },
      error: (err: any) => {
        console.error('Failed to save project', err);
        this.loading.set(false);
        
        if (err.status === 500 || err.status === 400) {
          this.errorMessage.set(this.i18n.translate('ADMIN_ERR_DUPLICATE'));
        } else {
          this.errorMessage.set(this.i18n.translate('ADMIN_ERR_GENERIC'));
        }
      }
    });
  }

  deleteProject(id: string) {
    if (!this.adminAuth.canEdit()) return;
    if (confirm(this.i18n.translate('ADMIN_CONFIRM_DELETE_PROJECT'))) {
      this.http.delete(`${environment.apiUrl}/projects/${id}`).subscribe({
        next: () => this.loadProjects(),
        error: (err: any) => console.error('Failed to delete project', err)
      });
    }
  }
}
