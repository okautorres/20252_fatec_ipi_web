// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../models/produto';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  produtos: Produto[] = [];
  loading = false;
  error = '';

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.loading = true;
    this.produtoService.listVitrine().subscribe({
      next: (res) => { this.produtos = res; this.loading = false; },
      error: (err) => {
        console.error('Erro carregando vitrine', err);
        this.error = 'Não foi possível carregar produtos (backend offline).';
        this.produtos = []; 
        this.loading = false;
      }
    });
  }

  verProduto(id: number) { /* router navigation se quiser */ }
}
