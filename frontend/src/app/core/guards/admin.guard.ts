import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  const token = localStorage.getItem('admin_token');
  
  if (token) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};
