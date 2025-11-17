import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class Cadastro implements OnInit {  // <-- implementar OnInit
  formCadastro!: FormGroup;
  alerta = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {  // <-- agora vai ser chamado
    this.formCadastro = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      termos: [false, Validators.requiredTrue]
    });
  }

  cadastrarUsuario() {
    if (this.formCadastro.invalid) {
      this.alerta = 'Preencha todos os campos corretamente.';
          console.log('chegou aqui');
      return;
    }

    const usuario = this.formCadastro.value;
    console.log('chegou aqui');
    this.http.post('http://localhost:8080/cliente/cadastro', usuario)
      .subscribe({
        next: (res: any) => {
          this.alerta = res.mensagem || 'Usuário cadastrado com sucesso!';
          this.formCadastro.reset();
        },
        error: () => this.alerta = 'Erro ao realizar o cadastro.'
      });
  }
}
