// src/app/services/storage.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private inMemoryToken: string | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setToken(token: string, remember: boolean) {
    if (this.isBrowser) {
      if (remember) {
        localStorage.setItem('access_token', token);
        localStorage.setItem('remember_me', '1');
      } else {
        sessionStorage.setItem('access_token', token);
        localStorage.removeItem('remember_me');
      }
    } else {
      // fallback para SSR — mantém só na memória do processo servidor
      this.inMemoryToken = token;
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem('access_token') ?? localStorage.getItem('access_token');
    }
    return this.inMemoryToken; // possivelmente null; no SSR normalmente você não quer enviar token
  }

  clear() {
    if (this.isBrowser) {
      sessionStorage.removeItem('access_token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('remember_me');
    }
    this.inMemoryToken = null;
  }

  isRemembered(): boolean {
    if (this.isBrowser) return !!localStorage.getItem('remember_me');
    return false;
  }
}
