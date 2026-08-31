import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  const token = isPlatformBrowser(platformId) ? localStorage.getItem('admin_token') : null;
  
  if (token) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};
