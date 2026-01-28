import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LanguageService } from '../../core/services/language.service';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            {{ t('CONTACT_TITLE') }}
          </h1>
          <p class="text-gray-400 text-lg">
            {{ t('CONTACT_SUBTITLE') }}
          </p>
        </div>

        <!-- Success Message -->
        @if (submitted()) {
          <div class="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-center mb-8">
            <div class="text-4xl mb-3">✅</div>
            <h3 class="text-xl font-bold text-white mb-2">{{ t('CONTACT_SUCCESS_TITLE') }}</h3>
            <p class="text-gray-400">{{ t('CONTACT_SUCCESS_DESC') }}</p>
          </div>
        }

        <!-- Contact Form -->
        @if (!submitted()) {
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('CONTACT_NAME') }}</label>
              <input type="text" [(ngModel)]="form.name" name="name" required
                     class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-tech-blue focus:outline-none transition-colors"
                     [placeholder]="t('CONTACT_NAME_PLACEHOLDER')">
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('CONTACT_EMAIL') }}</label>
              <input type="email" [(ngModel)]="form.email" name="email" required
                     class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-tech-blue focus:outline-none transition-colors"
                     placeholder="seu@email.com">
            </div>

            <!-- Subject -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('CONTACT_SUBJECT') }}</label>
              <input type="text" [(ngModel)]="form.subject" name="subject" required
                     class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-tech-blue focus:outline-none transition-colors"
                     [placeholder]="t('CONTACT_SUBJECT_PLACEHOLDER')">
            </div>

            <!-- Message -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('CONTACT_MESSAGE') }}</label>
              <textarea [(ngModel)]="form.message" name="message" required rows="5"
                        class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-tech-blue focus:outline-none transition-colors resize-none"
                        [placeholder]="t('CONTACT_MESSAGE_PLACEHOLDER')"></textarea>
            </div>

            <!-- Submit Button -->
            <button type="submit" [disabled]="submitting()"
                    class="w-full py-4 bg-tech-blue text-black font-bold rounded-xl hover:bg-tech-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              @if (submitting()) {
                <span class="animate-spin h-5 w-5 border-2 border-black/30 border-t-black rounded-full"></span>
              }
              {{ t('BTN_SEND') }}
            </button>

            <!-- Error Message -->
            @if (error()) {
              <div class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
                {{ error() }}
              </div>
            }
          </form>
        }

        <!-- Alternative Contact -->
        <div class="mt-12 text-center text-gray-400">
          <p>{{ t('CONTACT_ALT') }}</p>
          <a href="mailto:contact@olustack.dev" class="text-tech-blue hover:underline">
            contact@olustack.dev
          </a>
        </div>
      </div>
    </section>
  `
})
export class ContactComponent {
  private http = inject(HttpClient);
  langService = inject(LanguageService);

  form: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitting = signal(false);
  submitted = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    this.submitting.set(true);
    this.error.set(null);

    this.http.post(`${environment.apiUrl}/contacts`, this.form).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.error?.message || 'Erro ao enviar mensagem. Tente novamente.');
      }
    });
  }

  get t() {
    return (key: string) => this.langService.translate(key);
  }
}
