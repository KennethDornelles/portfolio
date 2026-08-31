import { Component, inject, AfterViewInit, ElementRef, ViewChildren, QueryList, OnDestroy, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TimelineService } from '../../core/services/timeline.service';
import { Observable, Subscription, of } from 'rxjs';
import { Experience } from '../../core/models/experience.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  private timelineService = inject(TimelineService);
  private platformId = inject(PLATFORM_ID);
  
  // Allow passing data via Input()
  @Input() data: Experience[] | null = null;
  
  // Observable to be used in the template
  experiences$!: Observable<Experience[]>;
  
  @ViewChildren('timelineItem') timelineItems!: QueryList<ElementRef>;
  private observer?: IntersectionObserver;
  private sub = new Subscription();

  constructor() {}

  ngOnInit() {
    // If input data is provided, use it. Otherwise, fetch from service.
    if (this.data) {
      this.experiences$ = of(this.data);
    } else {
      this.experiences$ = this.timelineService.getExperiences();
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.setupIntersectionObserver();
    
    // Re-observe when items change (e.g. async data load)
    this.sub.add(this.timelineItems.changes.subscribe(() => {
      this.setupIntersectionObserver();
    }));
  }

  ngOnDestroy() {
    if (this.observer) this.observer.disconnect();
    this.sub.unsubscribe();
  }

  private setupIntersectionObserver() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.observer) this.observer.disconnect();

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-12');
          this.observer?.unobserve(entry.target); // Animate only once
        }
      });
    }, options);

    this.timelineItems.forEach(item => {
      this.observer?.observe(item.nativeElement);
    });
  }
}
