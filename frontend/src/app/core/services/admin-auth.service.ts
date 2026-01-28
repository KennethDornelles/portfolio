import { Injectable, signal, computed } from '@angular/core';

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
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    this._user.set(user);
  }

  loginAsGuest() {
    const user: AdminUser = { email: 'guest@demo.com', name: 'Visitante Demo', role: 'GUEST' };
    localStorage.setItem('admin_token', 'demo-guest-token');
    localStorage.setItem('admin_user', JSON.stringify(user));
    this._user.set(user);
  }

  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    this._user.set(null);
  }

  getRole(): AdminRole {
    return this._user()?.role || null;
  }
}
