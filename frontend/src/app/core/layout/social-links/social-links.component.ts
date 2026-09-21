import { Component, inject } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

interface SocialLink {
  label: string;
  href: string;
  external: boolean;
}

@Component({
  selector: 'app-social-links',
  standalone: true,
  template: `
    <nav aria-label="Links profissionais" class="flex flex-wrap justify-center gap-4">
      @for (link of links; track link.label) {
        <a
          [href]="link.href"
          [target]="link.external ? '_blank' : null"
          [rel]="link.external ? 'noopener noreferrer' : null"
          class="rounded-full border border-white/10 px-4 py-2 text-gray-400 transition-colors hover:border-tech-blue/40 hover:text-tech-blue"
          (click)="track(link.label)"
        >
          {{ link.label }}
        </a>
      }
    </nav>
  `,
})
export class SocialLinksComponent {
  readonly links: SocialLink[] = [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/kennethjesus', external: true },
    { label: 'GitHub', href: 'https://github.com/KennethDornelles', external: true },
    { label: 'E-mail', href: 'mailto:kenneth.jesus@olustack.com.br', external: false },
  ];

  private readonly analytics = inject(AnalyticsService);

  track(label: string): void {
    this.analytics.track('social_click', { network: label });
  }
}
