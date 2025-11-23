// app.component.ts (atualize a classe App)
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [CommonModule, RouterModule]
})
export class App implements OnInit, OnDestroy {
  username: string | null = null;
  loggedIn = false;

  private subs = new Subscription();

  mobileMenuOpen = false;

  constructor(public auth: AuthService, private router: Router) {}

  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    console.log('toggleMenu ->', this.mobileMenuOpen);
  }

  ngOnInit() {
    this.subs.add(this.auth.getUsername$().subscribe(name => this.username = name));
    this.subs.add(this.auth.getLoggedIn$().subscribe(flag => this.loggedIn = flag));

    // Fecha o menu automaticamente quando houver navegação
    this.subs.add(
      this.router.events.pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => this.mobileMenuOpen = false)
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  logout() {
    this.auth.logout();
  }
}
