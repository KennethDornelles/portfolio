import { Router, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AdminAuthService);

  if (auth.isAuthenticated()) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};
