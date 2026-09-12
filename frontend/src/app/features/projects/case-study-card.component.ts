import { Component, input } from '@angular/core';

@Component({
  selector: 'app-case-study-card',
  standalone: true,
  template: `
    <article
      class="group relative bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10 overflow-hidden hover:border-tech-blue/30 transition-all duration-500"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity"
        [class]="color() === 'orange' ? 'from-orange-500 to-red-500' : 'from-purple-500 to-blue-500'"
      ></div>
      <div class="relative p-8">
        <ng-content />
      </div>
    </article>
  `,
})
export class CaseStudyCardComponent {
  readonly color = input<string>('purple');
}
