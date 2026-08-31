import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AdminRole = 'ADMIN' | 'GUEST' | null;

export interface AdminUser {
  email: string;
  name: string;
  role: AdminRole;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
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
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this._user.set(user);
      } catch {
        this.logout();
      }
    }
  }

  login(token: string, user: AdminUser) {
    if (this.isBrowser) {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
    }
    this._user.set(user);
  }

  loginAsGuest() {
    const user: AdminUser = { email: 'guest@demo.com', name: 'Visitante Demo', role: 'GUEST' };
    if (this.isBrowser) {
      localStorage.setItem('admin_token', 'demo-guest-token');
      localStorage.setItem('admin_user', JSON.stringify(user));
    }
    this._user.set(user);
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
    this._user.set(null);
  }

  getRole(): AdminRole {
    return this._user()?.role || null;
  }
}
