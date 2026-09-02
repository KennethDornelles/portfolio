import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { adminGuard } from './admin.guard';

function token(exp: number): string {
  return `header.${btoa(JSON.stringify({ exp }))}.signature`;
}

describe('adminGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
  });

  afterEach(() => localStorage.clear());

  it('redirects anonymous users to login', () => {
    const result = TestBed.runInInjectionContext(() => adminGuard({} as never, {} as never));
    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
  });

  it('allows a valid authenticated guest session to enter the read-only panel', () => {
    localStorage.setItem('access_token', token(Math.floor(Date.now() / 1000) + 300));
    localStorage.setItem('refresh_token', 'refresh-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ email: 'guest@example.com', name: 'Guest', role: 'GUEST' }),
    );

    const result = TestBed.runInInjectionContext(() => adminGuard({} as never, {} as never));

    expect(result).toBe(true);
  });

  it('allows a valid ADMIN session to enter the panel', () => {
    localStorage.setItem('access_token', token(Math.floor(Date.now() / 1000) + 300));
    localStorage.setItem('refresh_token', 'refresh-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ email: 'admin@example.com', name: 'Admin', role: 'ADMIN' }),
    );

    const result = TestBed.runInInjectionContext(() => adminGuard({} as never, {} as never));

    expect(result).toBe(true);
  });

  it('redirects an expired session to login', () => {
    localStorage.setItem('access_token', token(Math.floor(Date.now() / 1000) - 1));
    localStorage.setItem('refresh_token', 'expired-refresh-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ email: 'admin@example.com', name: 'Admin', role: 'ADMIN' }),
    );

    const result = TestBed.runInInjectionContext(() => adminGuard({} as never, {} as never));
    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
  });
});
