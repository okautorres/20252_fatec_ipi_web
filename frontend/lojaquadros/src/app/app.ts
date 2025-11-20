// app.component.ts (ou navbar.component.ts)
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


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

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.subs.add(this.auth.getUsername$().subscribe(name => this.username = name));
    this.subs.add(this.auth.getLoggedIn$().subscribe(flag => this.loggedIn = flag));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  logout() {
    this.auth.logout();
  }
}
