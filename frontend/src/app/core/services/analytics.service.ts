import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

interface AnalyticsWindow extends Window {
  gtag?: (command: 'event', eventName: string, params?: AnalyticsParams) => void;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  track(eventName: string, params: AnalyticsParams = {}): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const detail = {
      event: eventName,
      ...params,
      path: this.document.defaultView?.location.pathname,
    };
    this.document.defaultView?.dispatchEvent(new CustomEvent('portfolio:analytics', { detail }));

    const gtag = (this.document.defaultView as AnalyticsWindow | null)?.gtag;
    gtag?.('event', eventName, detail);
  }
}
