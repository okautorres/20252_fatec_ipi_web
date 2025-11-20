// src/app/activation/activation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActivationService } from '../services/activation.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="activation">
      <div *ngIf="loading">Ativando sua conta... Aguarde.</div>

      <div *ngIf="message" class="success">
        <h2>Sucesso</h2>
        <p>{{ message }}</p>
        <p><a routerLink="/login">Ir para login</a></p>
      </div>

      <div *ngIf="error" class="error">
        <h2>Erro</h2>
        <p>{{ error }}</p>
        <p><a routerLink="/">Voltar à home</a></p>
      </div>
    </div>
  `
})
export class ActivationComponent implements OnInit {
  loading = true;
  message: string | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private activationService: ActivationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');
      if (!token) {
        this.loading = false;
        this.error = 'Token de ativação ausente na URL.';
        return;
      }

      this.activationService.activate(token).pipe(
        catchError(err => {
          this.loading = false;
          // tenta pegar mensagem do backend, senão mensagem genérica
          this.error = err?.error?.message ?? `Erro ao ativar a conta (status ${err?.status}).`;
          return of(null);
        })
      ).subscribe(res => {
        if (!res) return;
        this.loading = false;
        this.message = res?.message ?? 'Conta ativada com sucesso!';
        // redireciona automaticamente para o login após 2.5s
        setTimeout(() => this.router.navigate(['/login']), 2500);
      });
    });
  }
}
