// src/app/services/activation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivationService {
  private api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // PATCH /cliente/ativar?token=...
  activate(token: string): Observable<any> {
    const params = new HttpParams().set('token', token);
    // corpo = null (não precisamos enviar body porque token vem na query)
    return this.http.patch(`${this.api}/cliente/ativar`, null, { params });
  }
}
