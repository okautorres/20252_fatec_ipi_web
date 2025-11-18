// src/app/cadastroprod/cadastroprod.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cadastro-prod',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './cadastroprod.html',
  styleUrls: ['./cadastroprod.css']
})
export class CadastroProd {
  formProduto: FormGroup;
  preview: string | null = null;
  selectedFile?: File;
  carregando = false;
  alerta = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.formProduto = this.fb.group({
      name: ['', Validators.required],
      descr: [''],
      value: [0, Validators.required],
      promo: [0],
      qt: [0, Validators.required],
      contrast: [50],
      keywords: [''],
       imageBase64: ['']
    });
  }

// método onFileSelected -> lê base64 e coloca no form
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    this.selectedFile = undefined;
    this.preview = null;
    this.formProduto.patchValue({ imageBase64: '' });
    return;
  }
  const file = input.files[0];
  this.selectedFile = file;
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result as string; // "data:image/png;base64,...."
    this.preview = dataUrl;
    this.formProduto.patchValue({ imageBase64: dataUrl });
  };
  reader.readAsDataURL(file);
}

// método salvarProduto -> enviar JSON
salvarProduto() {
  if (this.formProduto.invalid) {
    this.alerta = 'Preencha os campos obrigatórios.';
    return;
  }
  this.carregando = true;
  this.alerta = '';

  // monta o objeto Produto (inclui imageBase64)
  const produtoObj = {
    name: this.formProduto.value.name,
    descr: this.formProduto.value.descr || '',
    value: this.formProduto.value.value,
    promo: this.formProduto.value.promo || 0,
    qt: this.formProduto.value.qt,
    contrast: this.formProduto.value.contrast,
    keywords: this.formProduto.value.keywords || '',
    imageBase64: this.formProduto.value.imageBase64 || ''  // importante: string dataURL
  };

  // NÃO defina headers Content-Type manualmente — o HttpClient vai setar application/json automaticamente.
  this.http.post('http://localhost:8080/produto', produtoObj, { responseType: 'text' })
    .subscribe({
      next: res => {
        this.alerta = 'Produto salvo com sucesso.';
        this.formProduto.reset();
        this.preview = null;
        this.selectedFile = undefined;
        this.carregando = false;
      },
      error: err => {
        console.error(err);
        this.alerta = err?.error || 'Erro ao salvar produto.';
        this.carregando = false;
      }
    });
}


  limpar() {
    this.formProduto.reset();
    this.preview = null;
    this.selectedFile = undefined;
  }
}
