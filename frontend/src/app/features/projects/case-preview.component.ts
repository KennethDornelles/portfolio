import { Component, inject, input, signal } from '@angular/core';
import { AnalyticsService } from '../../core/services/analytics.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-case-preview',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="mb-6 rounded-2xl border border-tech-blue/20 bg-tech-blue/5 p-4">
      <button
        type="button"
        class="inline-flex items-center gap-2 text-sm font-semibold text-tech-blue hover:text-white transition-colors"
        [attr.aria-expanded]="open()"
        (click)="toggle()"
      >
        <span aria-hidden="true">{{ open() ? '−' : '+' }}</span>
        {{ 'PROJECT_CASE_CTA' | translate }}
      </button>

      @if (open()) {
        <div class="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p class="text-xs uppercase tracking-widest text-tech-blue">{{ projectName() }}</p>
            <p class="mt-1 text-sm text-gray-300">{{ tagline() }}</p>
          </div>
          <a
            [href]="repositoryUrl()"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-full border border-tech-blue/30 px-4 py-2 text-sm font-medium text-tech-blue hover:bg-tech-blue/10"
            (click)="trackCta()"
          >
            {{ 'PROJECT_CASE_CTA' | translate }}
          </a>
        </div>
      }
    </div>
  `,
})
export class CasePreviewComponent {
  readonly projectName = input.required<string>();
  readonly tagline = input.required<string>();
  readonly repositoryUrl = input.required<string>();
  readonly open = signal(false);

  private readonly analytics = inject(AnalyticsService);

  toggle(): void {
    const next = !this.open();
    this.open.set(next);
    this.analytics.track(next ? 'case_preview_open' : 'case_preview_close', {
      project: this.projectName(),
    });
  }

  trackCta(): void {
    this.analytics.track('case_preview_cta', { project: this.projectName() });
  }
}
