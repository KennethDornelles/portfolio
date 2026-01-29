import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('admin_token') ||
                localStorage.getItem('access_token');

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

  // Tratamento de erro com logging específico
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isI18nEndpoint(req.url)) {
        console.error('[I18N] Translation request failed:', {
          url: req.url,
          status: error.status,
          message: error.message
        });
      }
      return throwError(() => error);
    })
  );
};
