// src/app/services/storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private TOKEN_KEY = 'lq_access_token';

  // detecta ambiente browser (seguro para SSR)
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  }

  // salva token: se remember=true -> localStorage (persistente), senão sessionStorage (só sessão)
  setToken(token: string, remember = false): void {
    if (!this.isBrowser()) return; // não tenta acessar storage no servidor
    this.clear(); // limpar versões antigas pra manter 1 fonte
    try {
      if (remember) {
        localStorage.setItem(this.TOKEN_KEY, token);
      } else {
        sessionStorage.setItem(this.TOKEN_KEY, token);
      }
    } catch {
      // falha silenciosa (ex.: Storage full / bloqueado)
    }
  }

  // opcional: salvar em cookie (não httpOnly). use só se souber os riscos.
  setTokenCookie(token: string, days = 7, path = '/'): void {
    if (!this.isBrowser() || typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${this.TOKEN_KEY}=${encodeURIComponent(token)}; expires=${expires}; path=${path}`;
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    try {
      return sessionStorage.getItem(this.TOKEN_KEY) ?? localStorage.getItem(this.TOKEN_KEY) ?? this.getTokenFromCookie();
    } catch {
      return null;
    }
  }

  // retorna token de cookie (se existir)
  private getTokenFromCookie(): string | null {
    if (!this.isBrowser() || typeof document === 'undefined') return null;
    const name = this.TOKEN_KEY + '=';
    const ca = document.cookie ? document.cookie.split(';') : [];
    for (let c of ca) {
      c = c.trim();
      if (c.indexOf(name) === 0) {
        return decodeURIComponent(c.substring(name.length));
      }
    }
    return null;
  }

  clear(): void {
    if (!this.isBrowser()) return;
    try {
      sessionStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
      this.deleteTokenCookie();
    } catch {
      // ignore
    }
  }

  deleteTokenCookie(path = '/'): void {
    if (!this.isBrowser() || typeof document === 'undefined') return;
    document.cookie = `${this.TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
  }

  // utilitário: tenta decodificar JWT e retornar payload (se for JWT)
  parseJwt(token?: string): any | null {
    if (!this.isBrowser()) return null;
    try {
      const t = token ?? this.getToken();
      if (!t) return null;
      const parts = t.split('.');
      if (parts.length !== 3) return null;
      // atob disponível no browser
      const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      // decodeURIComponent/escape para garantir unicode
      return JSON.parse(decodeURIComponent(escape(payload)));
    } catch {
      return null;
    }
  }

  // utilitário: checar exp (se for jwt)
  isTokenExpired(): boolean {
    const payload = this.parseJwt();
    if (!payload || !payload.exp) return false; // se não for JWT, não assumimos expirado aqui
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }
}
