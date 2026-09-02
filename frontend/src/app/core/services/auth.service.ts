import { Injectable, inject } from '@angular/core';
import { AdminAuthService } from './admin-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly session = inject(AdminAuthService);
  readonly currentUser = this.session.user;
  readonly isAuthenticated = this.session.isAuthenticated;

  loginAsGuest() {
    return this.session.loginAsGuest();
  }

  logout() {
    this.session.logout();
  }
}
