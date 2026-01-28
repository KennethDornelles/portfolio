import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AdminAuthService } from '../../../../core/services/admin-auth.service';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-contacts-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Contatos</h1>
          <p class="text-gray-400">Mensagens recebidas pelo formulário de contato</p>
        </div>
        <div class="flex gap-2">
          @if (!adminAuth.canEdit()) {
            <span class="px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-xl text-sm">
              👁️ Modo Visualização
            </span>
          }
          <button (click)="filter = 'all'" 
                  [class]="filter === 'all' ? 'bg-tech-blue text-black' : 'bg-white/5 text-gray-400'"
                  class="px-4 py-2 rounded-xl font-medium transition-colors">
            Todos ({{ contacts().length }})
          </button>
          <button (click)="filter = 'unread'"
                  [class]="filter === 'unread' ? 'bg-tech-blue text-black' : 'bg-white/5 text-gray-400'"
                  class="px-4 py-2 rounded-xl font-medium transition-colors">
            Não lidos ({{ unreadCount() }})
          </button>
        </div>
      </div>

      <!-- Contacts List -->
      <div class="space-y-4">
        @for (contact of filteredContacts(); track contact.id) {
          <div class="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-tech-blue/30 transition-all"
               [class.border-l-4]="!contact.read"
               [class.border-l-tech-blue]="!contact.read">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-tech-blue/10 rounded-full flex items-center justify-center text-xl">
                    {{ contact.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h3 class="text-white font-semibold flex items-center gap-2">
                      {{ contact.name }}
                      @if (!contact.read) {
                        <span class="w-2 h-2 bg-tech-blue rounded-full"></span>
                      }
                    </h3>
                    <p class="text-gray-400 text-sm">{{ contact.email }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-500 text-sm">{{ contact.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                  @if (adminAuth.canEdit()) {
                    <button (click)="toggleRead(contact)"
                            class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            [title]="contact.read ? 'Marcar como não lido' : 'Marcar como lido'">
                      {{ contact.read ? '📭' : '📬' }}
                    </button>
                    <button (click)="deleteContact(contact.id)"
                            class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Excluir">
                      🗑️
                    </button>
                  }
                </div>
              </div>
              
              <div class="mb-3">
                <span class="text-tech-blue text-sm font-medium">Assunto:</span>
                <span class="text-white ml-2">{{ contact.subject }}</span>
              </div>
              
              <p class="text-gray-300 leading-relaxed whitespace-pre-wrap">{{ contact.message }}</p>
              
              @if (adminAuth.canEdit()) {
                <div class="mt-4 pt-4 border-t border-white/10 flex gap-3">
                  <a [href]="'mailto:' + contact.email + '?subject=Re: ' + contact.subject"
                     class="px-4 py-2 bg-tech-blue text-black font-medium rounded-xl hover:bg-tech-blue/80 transition-colors">
                    📧 Responder
                  </a>
                  <button (click)="copyEmail(contact.email)"
                          class="px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors">
                    📋 Copiar Email
                  </button>
                </div>
              }
            </div>
          </div>
        } @empty {
          <div class="bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
            <span class="text-4xl mb-4 block">📬</span>
            <p class="text-gray-400">
              {{ filter === 'unread' ? 'Nenhuma mensagem não lida' : 'Nenhum contato recebido' }}
            </p>
          </div>
        }
      </div>
    </div>
  `
})
export class ContactsAdminComponent implements OnInit {
  private http = inject(HttpClient);
  adminAuth = inject(AdminAuthService);
  
  contacts = signal<Contact[]>([]);
  filter: 'all' | 'unread' = 'all';

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.http.get<Contact[]>(`${environment.apiUrl}/contacts`).subscribe({
      next: (data) => this.contacts.set(data),
      error: (err) => console.error('Failed to load contacts', err)
    });
  }

  filteredContacts() {
    if (this.filter === 'unread') {
      return this.contacts().filter(c => !c.read);
    }
    return this.contacts();
  }

  unreadCount() {
    return this.contacts().filter(c => !c.read).length;
  }

  toggleRead(contact: Contact) {
    if (!this.adminAuth.canEdit()) return;
    this.http.patch(`${environment.apiUrl}/contacts/${contact.id}`, { read: !contact.read }).subscribe({
      next: () => {
        this.contacts.update(contacts => 
          contacts.map(c => c.id === contact.id ? { ...c, read: !c.read } : c)
        );
      }
    });
  }

  deleteContact(id: string) {
    if (!this.adminAuth.canEdit()) return;
    if (confirm('Tem certeza que deseja excluir este contato?')) {
      this.http.delete(`${environment.apiUrl}/contacts/${id}`).subscribe({
        next: () => this.contacts.update(contacts => contacts.filter(c => c.id !== id)),
        error: (err) => console.error('Failed to delete contact', err)
      });
    }
  }

  copyEmail(email: string) {
    navigator.clipboard.writeText(email);
  }
}
