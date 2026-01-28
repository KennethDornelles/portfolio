import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AdminAuthService } from '../../../../core/services/admin-auth.service';

interface Translation {
  key: string;
  pt_BR: string;
  en_US: string;
  editing?: boolean;
}

@Component({
  selector: 'app-translations-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Traduções</h1>
          <p class="text-gray-400">Gerencie as chaves de internacionalização (i18n)</p>
        </div>
        @if (adminAuth.canEdit()) {
          <button (click)="showAddModal = true"
                  class="px-4 py-2 bg-tech-blue text-black font-medium rounded-xl hover:bg-tech-blue/80 transition-colors">
            + Nova Chave
          </button>
        } @else {
          <span class="px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-xl text-sm">
            👁️ Modo Visualização
          </span>
        }
      </div>

      <!-- Search -->
      <div class="relative">
        <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar traduções..."
               class="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
          <p class="text-2xl font-bold text-white">{{ translations().length }}</p>
          <p class="text-gray-400 text-sm">Total de Chaves</p>
        </div>
        <div class="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10 text-center">
          <span class="text-purple-400 text-2xl">🇧🇷</span>
          <p class="text-gray-400 text-sm">Português</p>
        </div>
        <div class="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 text-center">
          <span class="text-blue-400 text-2xl">🇺🇸</span>
          <p class="text-gray-400 text-sm">English</p>
        </div>
      </div>

      <!-- Translations Table -->
      <div class="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <table class="w-full">
          <thead class="bg-white/5">
            <tr>
              <th class="text-left px-6 py-4 text-gray-400 font-medium text-sm">Chave</th>
              <th class="text-left px-6 py-4 text-gray-400 font-medium text-sm">🇧🇷 Português</th>
              <th class="text-left px-6 py-4 text-gray-400 font-medium text-sm">🇺🇸 English</th>
              @if (adminAuth.canEdit()) {
                <th class="text-right px-6 py-4 text-gray-400 font-medium text-sm">Ações</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (t of filteredTranslations(); track t.key) {
              <tr class="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td class="px-6 py-4">
                  <code class="text-tech-blue text-sm bg-tech-blue/10 px-2 py-1 rounded">{{ t.key }}</code>
                </td>
                <td class="px-6 py-4">
                  @if (t.editing && adminAuth.canEdit()) {
                    <input type="text" [(ngModel)]="t.pt_BR" 
                           class="w-full px-3 py-2 bg-white/10 border border-tech-blue/50 rounded-lg text-white focus:outline-none">
                  } @else {
                    <span class="text-gray-300">{{ t.pt_BR }}</span>
                  }
                </td>
                <td class="px-6 py-4">
                  @if (t.editing && adminAuth.canEdit()) {
                    <input type="text" [(ngModel)]="t.en_US"
                           class="w-full px-3 py-2 bg-white/10 border border-tech-blue/50 rounded-lg text-white focus:outline-none">
                  } @else {
                    <span class="text-gray-300">{{ t.en_US }}</span>
                  }
                </td>
                @if (adminAuth.canEdit()) {
                  <td class="px-6 py-4">
                    <div class="flex justify-end gap-2">
                      @if (t.editing) {
                        <button (click)="saveTranslation(t)"
                                class="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors">
                          ✅
                        </button>
                        <button (click)="cancelEdit(t)"
                                class="p-2 text-gray-400 hover:bg-white/10 rounded-lg transition-colors">
                          ❌
                        </button>
                      } @else {
                        <button (click)="startEdit(t)"
                                class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          ✏️
                        </button>
                        <button (click)="deleteTranslation(t.key)"
                                class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          🗑️
                        </button>
                      }
                    </div>
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="adminAuth.canEdit() ? 4 : 3" class="px-6 py-12 text-center text-gray-500">
                  {{ searchQuery ? 'Nenhuma tradução encontrada' : 'Nenhuma tradução cadastrada' }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Add Modal (admin only) -->
      @if (showAddModal && adminAuth.canEdit()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-graphite-900 rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
            <h2 class="text-xl font-bold text-white mb-6">Nova Tradução</h2>
            
            <form (submit)="addTranslation($event)" class="space-y-4">
              <div>
                <label class="block text-gray-400 text-sm mb-2">Chave</label>
                <input type="text" [(ngModel)]="newKey" name="key" required
                       placeholder="EX: BUTTON_SUBMIT"
                       class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50 font-mono">
              </div>
              
              <div>
                <label class="block text-gray-400 text-sm mb-2">🇧🇷 Português</label>
                <input type="text" [(ngModel)]="newPtBR" name="pt_BR" required
                       class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50">
              </div>
              
              <div>
                <label class="block text-gray-400 text-sm mb-2">🇺🇸 English</label>
                <input type="text" [(ngModel)]="newEnUS" name="en_US" required
                       class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-blue/50">
              </div>
              
              <div class="flex gap-3 pt-4">
                <button type="button" (click)="showAddModal = false"
                        class="flex-1 px-4 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors">
                  Cancelar
                </button>
                <button type="submit"
                        class="flex-1 px-4 py-3 bg-tech-blue text-black font-medium rounded-xl hover:bg-tech-blue/80 transition-colors">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class TranslationsAdminComponent implements OnInit {
  private http = inject(HttpClient);
  adminAuth = inject(AdminAuthService);
  
  translations = signal<Translation[]>([]);
  searchQuery = '';
  showAddModal = false;
  newKey = '';
  newPtBR = '';
  newEnUS = '';
  
  private originalValues = new Map<string, { pt_BR: string; en_US: string }>();

  ngOnInit() {
    this.loadTranslations();
  }

  loadTranslations() {
    this.http.get<Record<string, string>>(`${environment.apiUrl}/i18n/PT_BR`).subscribe({
      next: (ptBR) => {
        this.http.get<Record<string, string>>(`${environment.apiUrl}/i18n/EN_US`).subscribe({
          next: (enUS) => {
            const keys = new Set([...Object.keys(ptBR), ...Object.keys(enUS)]);
            const translations: Translation[] = [];
            keys.forEach(key => {
              translations.push({
                key,
                pt_BR: ptBR[key] || '',
                en_US: enUS[key] || ''
              });
            });
            this.translations.set(translations.sort((a, b) => a.key.localeCompare(b.key)));
          }
        });
      }
    });
  }

  filteredTranslations() {
    if (!this.searchQuery) return this.translations();
    const query = this.searchQuery.toLowerCase();
    return this.translations().filter(t => 
      t.key.toLowerCase().includes(query) ||
      t.pt_BR.toLowerCase().includes(query) ||
      t.en_US.toLowerCase().includes(query)
    );
  }

  startEdit(t: Translation) {
    if (!this.adminAuth.canEdit()) return;
    this.originalValues.set(t.key, { pt_BR: t.pt_BR, en_US: t.en_US });
    t.editing = true;
  }

  cancelEdit(t: Translation) {
    const original = this.originalValues.get(t.key);
    if (original) {
      t.pt_BR = original.pt_BR;
      t.en_US = original.en_US;
    }
    t.editing = false;
  }

  saveTranslation(t: Translation) {
    if (!this.adminAuth.canEdit()) return;
    t.editing = false;
    console.log('Save translation:', t);
  }

  deleteTranslation(key: string) {
    if (!this.adminAuth.canEdit()) return;
    if (confirm(`Tem certeza que deseja excluir a chave "${key}"?`)) {
      this.translations.update(ts => ts.filter(t => t.key !== key));
    }
  }

  addTranslation(event: Event) {
    event.preventDefault();
    if (!this.adminAuth.canEdit()) return;
    const newTranslation: Translation = {
      key: this.newKey.toUpperCase().replace(/\s+/g, '_'),
      pt_BR: this.newPtBR,
      en_US: this.newEnUS
    };
    this.translations.update(ts => [...ts, newTranslation].sort((a, b) => a.key.localeCompare(b.key)));
    this.showAddModal = false;
    this.newKey = '';
    this.newPtBR = '';
    this.newEnUS = '';
  }
}
