import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    CommonModule,          // para *ngIf, *ngFor etc.
    ReactiveFormsModule,   // para formGroup, formControlName
    RouterModule           // se usar routerLink no template
  ]
})
export class LoginComponent implements OnInit {
  loading = false;
  error: string | null = null;
  form!: FormGroup; // será inicializado no ngOnInit

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // inicializa o form após o constructor ter rodado
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.error = null;
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
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Erro ao autenticar. Verifique suas credenciais.';
      }
    });
  }
}
