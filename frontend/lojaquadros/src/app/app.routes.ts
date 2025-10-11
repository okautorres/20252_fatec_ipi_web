
import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Sobre } from './sobre/sobre';
import { Usuarios } from './usuarios/usuarios';
import { Cadastro } from './cadastro/cadastro';

export const routes: Routes = [

  { path: 'home', component: Home },


  { path: '', redirectTo: '/home', pathMatch: 'full' },
  

  { path: 'sobre', component: Sobre },
  { path: 'usuarios', component: Usuarios },
  { path: 'cadastro', component: Cadastro },

];