import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export type AdminRole = 'ADMIN' | 'GUEST' | null;

export interface AdminUser {
  email: string;
  name: string;
  role: AdminRole;
}

interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: AdminUser;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private _user = signal<AdminUser | null>(null);
  
  user = this._user.asReadonly();
  
  isAuthenticated = computed(() => !!this._user());
  isAdmin = computed(() => this._user()?.role === 'ADMIN');
  isGuest = computed(() => this._user()?.role === 'GUEST');
  canEdit = computed(() => this._user()?.role === 'ADMIN');

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (!this.isBrowser) return;
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userStr = localStorage.getItem('auth_user');
    
    if (token && userStr && !this.isExpired(token) && (refreshToken || this.isGuestUser(userStr))) {
      try {
        const user = JSON.parse(userStr) as AdminUser;
        this._user.set(user);
      } catch {
        this.logout(false, false);
      }
    } else if (token || refreshToken || userStr) {
      this.logout(false, false);
    }
  }

  login(token: string, user: AdminUser, refreshToken?: string) {
    if (this.isBrowser) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    }
    this._user.set(user);
  }

  loginAsGuest(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/guest`, {})
      .pipe(tap((response) => this.storeSession(response)));
  }

  refresh() {
    const refreshToken = this.isBrowser ? localStorage.getItem('refresh_token') : null;
    if (!refreshToken) {
      this.logout(false);
      return;
    }
    this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, {}, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
      .subscribe({ next: (response) => this.storeSession(response), error: () => this.logout(false) });
  }

  logout(navigate = true, revoke = true) {
    const token = this.isBrowser ? localStorage.getItem('access_token') : null;
    if (token && revoke) {
      this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({ error: () => undefined });
    }
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
    this._user.set(null);
    if (navigate) void this.router.navigate(['/']);
  }

  getRole(): AdminRole {
    return this._user()?.role || null;
  }

  private storeSession(response: AuthResponse) {
    this.login(response.accessToken, response.user);
    if (this.isBrowser && response.refreshToken) localStorage.setItem('refresh_token', response.refreshToken);
  }

  private isGuestUser(serializedUser: string): boolean {
    try {
      return (JSON.parse(serializedUser) as AdminUser).role === 'GUEST';
    } catch {
      return false;
    }
  }

  private isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
      return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
