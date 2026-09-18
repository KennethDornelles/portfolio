import { Component, input } from '@angular/core';

@Component({
  selector: 'app-case-study-video',
  standalone: true,
  template: `
    @if (src()) {
      <figure class="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <video
          class="w-full aspect-video object-cover"
          controls
          autoplay
          muted
          [defaultMuted]="true"
          [muted]="true"
          playsinline
          preload="metadata"
          [poster]="poster() || null"
        >
          <source [src]="src()" type="video/mp4" />
        </video>
        <figcaption class="px-4 py-3 text-sm text-gray-400">{{ label() }}</figcaption>
      </figure>
    }
  `,
})
export class CaseStudyVideoComponent {
  readonly src = input<string | null>(null);
  readonly poster = input<string | null>(null);
  readonly label = input<string>('Product demonstration');
}
