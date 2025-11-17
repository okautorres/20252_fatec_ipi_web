import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/login-request.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
private api = 'http://localhost:8080';


constructor(private http: HttpClient) {}


login(payload: LoginRequest): Observable<LoginResponse> {
return this.http.post<LoginResponse>(`${this.api}/cliente/login`, payload).pipe(
tap(res => {
if (res && res.accessToken) {
localStorage.setItem('access_token', res.accessToken);
if (payload.rememberMe) {
localStorage.setItem('remember_me', '1');
} else {
localStorage.removeItem('remember_me');
}
}
})
);
}


logout() {
localStorage.removeItem('access_token');
localStorage.removeItem('remember_me');
// navegar para login se quiser — não incluí Router aqui por ser responsabilidade do componente
}


getToken() {
return localStorage.getItem('access_token');
}


isAuthenticated(): boolean {
return !!this.getToken();
}
}