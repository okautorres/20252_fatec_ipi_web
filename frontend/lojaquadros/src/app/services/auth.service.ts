// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-request.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8080';

  constructor(private http: HttpClient, private storage: StorageService, private router: Router) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/cliente/login`, payload).pipe(
      tap(res => {
        if (res?.accessToken) {
          this.storage.setToken(res.accessToken, !!payload.rememberMe);
        }
      })
    );
  }

  logout() {
    this.storage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
