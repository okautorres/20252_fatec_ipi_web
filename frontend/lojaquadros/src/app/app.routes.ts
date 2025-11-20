
import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Sobre } from './sobre/sobre';
import { CadastroProd } from './cadastroprod/cadastroprod';
import { Cadastro } from './cadastro/cadastro';
import { LoginComponent } from './login/login';
import {Esqueci} from './esqueci/esqueci';
import { Busca } from './busca/busca';
import {Carrinho} from './carrinho/carrinho';
import {Pedidos} from './pedidos/pedidos';


export const routes: Routes = [

  { path: 'home', component: Home },


  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'pedidos', component: Pedidos},
  {path: 'carrinho', component: Carrinho},  
  {path: 'busca', component: Busca},
  { path: 'sobre', component: Sobre },
  {path: 'login', component: LoginComponent},
  {path: 'esqueci', component: Esqueci},
  { path: 'cadastroprod', component: CadastroProd },
  {
    path: 'ativar',
    loadComponent: () => import('./activation/activation').then(m => m.ActivationComponent)
  },
  { path: 'cadastro', component: Cadastro },

];