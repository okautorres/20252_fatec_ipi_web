import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule]
})
export class Cadastro implements OnInit {
  formCadastro!: FormGroup;
  alerta = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.formCadastro = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      termos: [false, Validators.requiredTrue]
    }, {
      validators: this.senhasIguaisValidator
    });
  }

  // Getter para facilitar acesso no template: f.nomeDoControle
  get f(): { [key: string]: AbstractControl } {
    return this.formCadastro.controls;
  }

  // Validador customizado para confirmar se senha e confirmarSenha são iguais
  senhasIguaisValidator(group: AbstractControl) {
    const senha = group.get('password')?.value;
    const confirmar = group.get('confirmarSenha')?.value;
    if (senha && confirmar && senha !== confirmar) {
      group.get('confirmarSenha')?.setErrors({ naoIgual: true });
      return { naoIgual: true };
    }
    // se não houver erro específico, limpar erro 'naoIgual' (se existia)
    if (group.get('confirmarSenha')?.hasError('naoIgual') && senha === confirmar) {
      const errors = group.get('confirmarSenha')?.errors;
      if (errors) {
        delete errors['naoIgual'];
        if (Object.keys(errors).length === 0) {
          group.get('confirmarSenha')?.setErrors(null);
        } else {
          group.get('confirmarSenha')?.setErrors(errors);
        }
      }
    }
    return null;
  }

  cadastrarUsuario() {
    if (this.formCadastro.invalid) {
      this.alerta = 'Preencha todos os campos corretamente.';
      console.log('Form inválido:', this.formCadastro.errors, this.formCadastro.value);
      return;
    }

    const usuario = {
      name: this.f['name'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
      // envie apenas os campos que seu backend espera
    };

    console.log('Enviando usuário:', usuario);
    this.http.post('http://localhost:8080/cliente/cadastro', usuario)
      .subscribe({
        next: (res: any) => {
          this.alerta = res?.mensagem || 'Usuário cadastrado com sucesso!';
          this.formCadastro.reset();
        },
        error: (err) => {
          console.error(err);
          this.alerta = err?.error?.mensagem || 'Erro ao realizar o cadastro.';
        }
      });
  }
}
