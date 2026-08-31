import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const token = isPlatformBrowser(platformId)
    ? localStorage.getItem('admin_token') || localStorage.getItem('access_token')
    : null;

  // Helper para identificar endpoints i18n
  const isI18nEndpoint = (url: string): boolean => {
    const normalized = url.toLowerCase();
    return normalized.includes('/i18n/') ||
           normalized.includes('/i18n?') ||
           normalized.endsWith('/i18n');
  };

  let clonedReq = req;

  if (isI18nEndpoint(req.url)) {
    // Para i18n: headers básicos, SEM autenticação
    clonedReq = req.clone({
      setHeaders: { 'Accept': 'application/json' }
    });
  } else if (token) {
    // Para endpoints protegidos: adiciona autenticação
    clonedReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
  } else {
    // Endpoints públicos: headers básicos
    clonedReq = req.clone({
      setHeaders: { 'Accept': 'application/json' }
    });
  }

  return next(clonedReq);
};
