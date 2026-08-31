import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor SSR', () => {
  it('does not access localStorage and sends public i18n without Authorization', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    const http = TestBed.inject(HttpTestingController);
    const client = TestBed.inject(HttpClient);
    client.get('/api/i18n/PT_BR').subscribe();

    const request = http.expectOne('/api/i18n/PT_BR');
    expect(request.request.headers.has('Authorization')).toBe(false);
    expect(request.request.headers.get('Accept')).toBe('application/json');
    request.flush({ NAV_HOME: 'Início' });
    http.verify();
  });
});
