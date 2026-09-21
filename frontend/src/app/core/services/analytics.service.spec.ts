import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsService);
  });

  it('dispatches a browser event with the event name and context', () => {
    const received: Event[] = [];
    const listener = (event: Event) => received.push(event);
    window.addEventListener('portfolio:analytics', listener);

    service.track('test_event', { source: 'unit' });

    window.removeEventListener('portfolio:analytics', listener);
    expect(received).toHaveLength(1);
    expect((received[0] as CustomEvent).detail).toMatchObject({
      event: 'test_event',
      source: 'unit',
    });
  });
});
