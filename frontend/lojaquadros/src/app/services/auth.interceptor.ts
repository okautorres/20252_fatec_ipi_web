// interceptor funcional
import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn =
  (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {

    const storage = inject(StorageService);
    const router = inject(Router);

    const token = storage.getToken();
    const cloned = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    return next(cloned).pipe(
      catchError((err: any) => {
        if (err?.status === 401) {
          storage.clear();
          // evita redirect se já estiver em /login
          if (router.url !== '/login') router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  };
