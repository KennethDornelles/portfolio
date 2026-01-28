import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  accessToken: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Signal to track auth state
  currentUser = signal<any>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    // Check if we have a token on startup
    const token = localStorage.getItem('access_token');
    if (token) {
        this.isAuthenticated.set(true);
        // Ideally we decode the token or fetch /me
    }
  }

  loginAsGuest() {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/guest`, {}).pipe(
      timeout(3000), // 3 second timeout
      tap(response => {
        localStorage.setItem('access_token', response.accessToken);
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      }),
      catchError(() => {
        // Fallback to local mock if backend is down
        const mockResponse: AuthResponse = {
          accessToken: 'demo-guest-token',
          user: { email: 'guest@demo.com', role: 'GUEST', name: 'Visitante Demo' }
        };
        localStorage.setItem('access_token', mockResponse.accessToken);
        this.currentUser.set(mockResponse.user);
        this.isAuthenticated.set(true);
        return of(mockResponse);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }
}
