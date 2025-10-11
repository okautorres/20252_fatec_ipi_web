import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css'],
   standalone: true, 
  imports: [ReactiveFormsModule, HttpClientModule] 
})
export class Cadastro {
  formCadastro!: FormGroup;
  alerta = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    // Inicializa o formulário com os campos e validações
    this.formCadastro = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      termos: [false, Validators.requiredTrue]
    });
  }

  cadastrarUsuario() {
    if (this.formCadastro.invalid) {
      this.alerta = 'Preencha todos os campos corretamente.';
      return;
    }

    const usuario = this.formCadastro.value;

    this.http.post('http://localhost:3000/api/usuarios', usuario)
      .subscribe({
        next: (res: any) => {
          this.alerta = res.mensagem || 'Usuário cadastrado com sucesso!';
          this.formCadastro.reset();
        },
        error: () => this.alerta = 'Erro ao realizar o cadastro.'
      });
  }
}
