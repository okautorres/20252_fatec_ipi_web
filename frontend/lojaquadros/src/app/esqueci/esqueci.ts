import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-esqueci',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './esqueci.html',
  styleUrls: ['./esqueci.css']
})
export class Esqueci {
  formEsqueci: FormGroup;
  alerta = '';
  carregando = false;

  constructor(private fb: FormBuilder, private http: HttpClient ,private cd: ChangeDetectorRef) {
    this.formEsqueci = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // getter seguro para usar no template
  get f(): { [key: string]: AbstractControl } {
    return this.formEsqueci.controls;
  }

  enviarLink() {
    if (this.formEsqueci.invalid) {
      this.alerta = 'Digite um e-mail válido.';
      return;
    }

    this.alerta = '';
    this.carregando = true;

    // O backend espera um Cliente no body; aqui enviamos o objeto com o campo email.
    const payload = { email: this.f['email'].value };

  this.http.post('http://localhost:8080/cliente/redefinir-senha', payload, { responseType: 'text' })
  .subscribe({
    next: (res: any) => {
      this.alerta = 'Se o e-mail estiver cadastrado, enviamos um link de redefinição.';
      this.formEsqueci.reset();
      this.carregando = false;
    },
    error: (err) => {
  console.log('Erro HTTP ao requisitar redefinição:', err);

  // extrai mensagem com segurança
  let mensagem = 'Erro ao enviar o link. Tente novamente mais tarde.';
  if (err && typeof err.error === 'string' && err.error.trim().length > 0) {
    mensagem = err.error;
  } else if (err?.error && typeof err.error === 'object') {
    mensagem = err.error.mensagem || err.error.message || mensagem;
  } else if (err?.status === 404) {
    mensagem = 'não existe esse email';
  }

  // 1) Console confirm
  console.log('Mensagem para o usuário:', mensagem);

  // 2) ALERT do browser (debug rápido) — remova depois
  try { window.alert('DEBUG: ' + mensagem); } catch(e) {}

  // 3) setar a variável do componente e forçar change detection
  this.alerta = mensagem;
  try { this.cd.detectChanges(); } catch(e) {}

  // 4) criar um elemento fixo no DOM (garante visibilidade, remove depois)
  document.getElementById('debug-alert')?.remove();
  const el = document.createElement('div');
  el.id = 'debug-alert';
  el.style.position = 'fixed';
  el.style.left = '10px';
  el.style.bottom = '10px';
  el.style.padding = '12px 16px';
  el.style.background = 'rgba(200,30,30,0.95)';
  el.style.color = 'white';
  el.style.fontWeight = '700';
  el.style.borderRadius = '6px';
  el.style.zIndex = '99999';
  el.innerText = mensagem;
  document.body.appendChild(el);

  // opcional: auto-remover após 6s
  setTimeout(() => document.getElementById('debug-alert')?.remove(), 6000);
}

  });

  }
}
