// src/app/login/login.component.ts
import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login-request.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class LoginComponent implements OnInit {
  loading = false;
  // reativo: BehaviorSubject para mensagens de erro
  error$ = new BehaviorSubject<string | null>(null);

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    // limpa mensagem anterior
    this.error$.next(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: LoginRequest = {
      email: this.f['email'].value || '',
      password: this.f['password'].value || '',
      rememberMe: this.f['rememberMe'].value ?? false
    };

    this.auth.login(payload).subscribe({
      next: (response) => {
        // resultado do backend
        this.ngZone.run(() => {
          this.loading = false;

          // considera sucesso apenas se houver name ou token
          if (response?.name || response?.token) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth', 'true');
              if (response.name) localStorage.setItem('username', response.name);
              if (response.token) localStorage.setItem('token', response.token);
            }
            this.router.navigateByUrl('/');
          } else {
            // backend retornou 200 mas sem dados válidos
            this.error$.next('Resposta de login inválida.');
          }
        });
      },
      error: (err) => {
        // trata erro vindo do servidor (401/403 ou body com { message })
        this.ngZone.run(() => {
          this.loading = false;

          // extrai mensagem do formato comum { message: '...' }
          const msgFromBody = err?.error && typeof err.error === 'object' ? err.error.message : null;
          const msg = msgFromBody || (err?.status === 401 ? 'E-mail ou senha incorretos.' :
                      err?.status === 403 ? 'Conta inativa. Verifique seu e-mail.' :
                      'Erro ao autenticar. Tente novamente.');

          this.error$.next(msg);
        });
      }
    });
  }
}
