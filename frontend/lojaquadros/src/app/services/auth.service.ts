import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://localhost:8080';

  private AUTH_KEY = 'auth';
  private USER_KEY = 'username';
  private TOKEN_KEY = 'token';


  // 👇 NÃO PODE usar localStorage aqui!!!
  private loggedIn$ = new BehaviorSubject<boolean>(false);
  private username$ = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    // Inicializa somente no browser
    if (this.isBrowser()) {
      this.loggedIn$.next(this.loadIsLoggedIn());
      this.username$.next(this.loadUserName());
    }
  }

  private isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  // ---------- LOGIN ----------
 // no auth.service.ts (assumindo isBrowser() já implementado)
login(payload: any): Observable<any> {
  return this.http.post<any>(`${this.base}/cliente/login`, payload).pipe(
    tap(response => {
      console.log('AuthService login response', response);
      if (!response) {
        // nada a fazer
        return;
      }
      // preferível usar token; aqui usamos name como mínimo
      if (this.isBrowser() && response.name) {
        localStorage.setItem(this.AUTH_KEY, 'true');
        localStorage.setItem(this.USER_KEY, response.name);
        if (response.token) localStorage.setItem(this.TOKEN_KEY, response.token);
        this.loggedIn$.next(true);
        this.username$.next(response.name);
      } else {
        // não marque como autenticado
        this.loggedIn$.next(false);
        this.username$.next(null);
      }
    })
  );
}


  // ---------- LOGOUT ----------
  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem(this.AUTH_KEY);
      localStorage.removeItem(this.USER_KEY);
    }

    this.loggedIn$.next(false);
    this.username$.next(null);
  }

  // ---------- GETTERS ----------
  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  getUserName(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.USER_KEY);
  }

  getLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  getUsername$(): Observable<string | null> {
    return this.username$.asObservable();
  }

  // ---------- SAFE LOADERS ----------
  private loadIsLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  private loadUserName(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.USER_KEY);
  }
}
