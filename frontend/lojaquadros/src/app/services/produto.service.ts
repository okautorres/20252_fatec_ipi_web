// src/app/services/produto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Produto } from '../models/produto';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private base = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  listVitrine(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.base}/produtos/vitrine`)
      .pipe(
        retry(1),
        catchError(err => this.handleErrorFallback(err, []))
      );
  }

  listAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.base}/produtos`)
      .pipe(catchError(err => this.handleErrorFallback(err, [])));
  }

  get(id: number) {
      if (!id) return;
    return this.http.get<Produto>(`${this.base}/produto/${id}`)
      .pipe(catchError(err => this.handleErrorFallback(err, null)));
  }

  private handleErrorFallback<T>(error: HttpErrorResponse, fallback: T): Observable<T> {
    console.error('ProdutoService error:', error);
    return of(fallback as T);
  }
}
