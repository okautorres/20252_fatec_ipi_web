// src/app/home/home.component.ts
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../models/produto';
import { FormsModule } from '@angular/forms';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy {

  produtos: Produto[] = [];
  loading = false;
  error = '';

  private subs = new Subscription();

  constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private cd: ChangeDetectorRef   // <--- necessário
  ) {}

  ngOnInit(): void {
    console.log('[Home] INIT');

    // Carrega a vitrine na entrada
    this.loadVitrine();

    // Recarregar quando voltar para a rota principal
    const navSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((ev) => {
        console.log('[Home] NavigationEnd:', ev.urlAfterRedirects);

        // garante que só recarrega se voltar para '/'
        if (ev.urlAfterRedirects === '/' || ev.urlAfterRedirects.startsWith('/home')) {
          this.loadVitrine();
        }
      });

    this.subs.add(navSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ===========================================
  // MÉTODO PRINCIPAL QUE CARREGA OS PRODUTOS
  // ===========================================
  private loadVitrine(): void {
    console.log('[Home] loadVitrine() chamado — início', new Date().toISOString());

    this.loading = true;
    this.error = '';

    const pSub = this.produtoService.listVitrine().subscribe({
      next: (res) => {
        console.log('[Home] listVitrine() respondeu com', res?.length ?? 'NADA');

        this.produtos = res;
        this.loading = false;

        // <<< CORREÇÃO CRÍTICA >>>
        // Força a atualização da UI quando o Angular não detecta mudanças automaticamente
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('[Home] Erro carregando vitrine', err);
        this.error = 'Não foi possível carregar produtos (backend offline).';
        this.produtos = [];
        this.loading = false;

        this.cd.detectChanges();
      }
    });

    this.subs.add(pSub);
  }

  // ===========================================
  // trackBy — melhora renderização e evita bugs
  // ===========================================
  trackByProdutoId(index: number, item: Produto): number {
    return item?.id ?? index;
  }

  // ===========================================
  verProduto(id: number) {
    // navegação futura aqui
  }
}
