// src/app/services/produto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Produto } from '../models/produto';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private base = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  listVitrine(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.base}/produtos/vitrine`)
      .pipe(
        retry(1),
        map(list => (list || []).map(p => this.withFullImageUrl(p))),
        catchError(err => this.handleErrorFallback(err, []))
      );
  }

  listAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.base}/produtos`)
      .pipe(
        retry(1),
        map(list => (list || []).map(p => this.withFullImageUrl(p))),
        catchError(err => this.handleErrorFallback(err, []))
      );
  }

  get(id: number): Observable<Produto | null> {
    if (!id) return of(null);
    return this.http.get<Produto>(`${this.base}/produto/${id}`)
      .pipe(
        retry(1),
        map(p => p ? this.withFullImageUrl(p) : null),
        catchError(err => this.handleErrorFallback(err, null))
      );
  }

private withFullImageUrl(p: Produto): Produto {
  if (!p) return p;

  if (p.imageUrl) {

    // --- Caso 1: URL completa já (nada a fazer)
    if (p.imageUrl.startsWith('http://') || p.imageUrl.startsWith('https://')) {
      return p;
    }

    // --- Caso 2: assets do Angular (servidos em http://localhost:4200)
    if (p.imageUrl.startsWith('/assets')) {
      // deixe exatamente assim, NÃO prefixe http://localhost:8080
      return p;
    }

    // --- Caso 3: uploads servidos pelo backend
    if (p.imageUrl.startsWith('/uploads')) {
      p.imageUrl = this.base + p.imageUrl;  // http://localhost:8080/uploads/...
      return p;
    }

    // --- Caso 4: caminho estranho → tenta prefixar base
    p.imageUrl = this.base + '/' + p.imageUrl;
  }

  return p;
}

  private handleErrorFallback<T>(error: HttpErrorResponse, fallback: T): Observable<T> {
    console.error('ProdutoService error:', error);
    return of(fallback as T);
  }
}
