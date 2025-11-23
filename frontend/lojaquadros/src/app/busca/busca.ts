// src/app/busca/home.component.ts
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
  templateUrl: './busca.html',
  styleUrls: ['./busca.css']
})
export class Busca implements OnInit {
  produtos: Produto[] = [];
  loading = false;
  error = '';
  termo: string = '';

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    // opcional carregar vitrine, mas para busca talvez não precise
  }

  pesquisar() {
    if (!this.termo.trim()) {
      this.produtos = [];
      return;
    }

    this.loading = true;

    this.produtoService.busca(this.termo).subscribe({
      next: (res) => {
        this.produtos = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar', err);
        this.error = 'Erro ao buscar produtos.';
        this.loading = false;
      }
    });
  }
}

