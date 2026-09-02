import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';
import { environment } from '../../../environments/environment';

function token(exp: number): string {
  const payload = btoa(JSON.stringify({ sub: 'user-id', exp }));
  return `header.${payload}.signature`;
}

describe('AdminAuthService session restoration', () => {
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

  it('restores a valid session from the unified storage keys', () => {
    localStorage.setItem('access_token', token(Math.floor(Date.now() / 1000) + 300));
    localStorage.setItem('refresh_token', 'refresh-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ email: 'admin@example.com', name: 'Admin', role: 'ADMIN' }),
    );

    const service = TestBed.inject(AdminAuthService);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.isAdmin()).toBe(true);
    expect(service.user()?.email).toBe('admin@example.com');
  });

  it('clears an expired session instead of restoring it', () => {
    localStorage.setItem('access_token', token(Math.floor(Date.now() / 1000) - 1));
    localStorage.setItem('refresh_token', 'refresh-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ email: 'admin@example.com', name: 'Admin', role: 'ADMIN' }),
    );

    const service = TestBed.inject(AdminAuthService);

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });

  it('does not access browser storage during SSR', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    const service = TestBed.inject(AdminAuthService);

    expect(service.isAuthenticated()).toBe(false);
  });

  it('rotates the access and refresh tokens when refresh succeeds', () => {
    localStorage.setItem('access_token', token(Math.floor(Date.now() / 1000) + 30));
    localStorage.setItem('refresh_token', 'old-refresh-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ email: 'admin@example.com', name: 'Admin', role: 'ADMIN' }),
    );
    const service = TestBed.inject(AdminAuthService);
    const http = TestBed.inject(HttpTestingController);

    service.refresh();
    const request = http.expectOne(`${environment.apiUrl}/auth/refresh`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer old-refresh-token');
    request.flush({
      accessToken: token(Math.floor(Date.now() / 1000) + 300),
      refreshToken: 'new-refresh-token',
      user: { email: 'admin@example.com', name: 'Admin', role: 'ADMIN' },
    });

    expect(localStorage.getItem('refresh_token')).toBe('new-refresh-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('clears the session when refresh fails', () => {
    localStorage.setItem('access_token', token(Math.floor(Date.now() / 1000) + 30));
    localStorage.setItem('refresh_token', 'expired-refresh-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ email: 'admin@example.com', name: 'Admin', role: 'ADMIN' }),
    );
    const service = TestBed.inject(AdminAuthService);
    const http = TestBed.inject(HttpTestingController);

    service.refresh();
    http.expectOne(`${environment.apiUrl}/auth/refresh`).flush(
      { message: 'Unauthorized' },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });

  it('revokes the backend session and clears local state on logout', () => {
    localStorage.setItem('access_token', token(Math.floor(Date.now() / 1000) + 300));
    localStorage.setItem('refresh_token', 'refresh-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ email: 'admin@example.com', name: 'Admin', role: 'ADMIN' }),
    );
    const service = TestBed.inject(AdminAuthService);
    const http = TestBed.inject(HttpTestingController);

    service.logout(false);
    http.expectOne(`${environment.apiUrl}/auth/logout`).flush({ success: true });

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.length).toBe(0);
  });
});
