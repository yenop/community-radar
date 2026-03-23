import { Component } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ApiService } from "../../core/services/api.service";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
<div class="app" [class.nav-open]="navOpen">
  <!-- Overlay mobile -->
  <div class="overlay" (click)="navOpen=false" *ngIf="navOpen"></div>

  <!-- Burger button (mobile) -->
  <button class="burger" (click)="navOpen=!navOpen" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>

  <nav class="sidebar" [class.open]="navOpen">
    <div class="logo">📡 Community<br><span>Radar</span></div>
    <a routerLink="/dashboard" routerLinkActive="active" (click)="navOpen=false">
      📊 Dashboard
      <span class="badge" *ngIf="newCount > 0">{{newCount}}</span>
    </a>
    <a routerLink="/criteria" routerLinkActive="active" (click)="navOpen=false">🎯 Critères</a>
    <a routerLink="/sources" routerLinkActive="active" (click)="navOpen=false">📡 Sources</a>
    <a routerLink="/stats" routerLinkActive="active" (click)="navOpen=false">📈 Stats</a>
  </nav>

  <main class="content"><router-outlet/></main>
</div>
  `,
  styles: [`
    .app { display:flex; min-height:100vh; background:#1a1a2e; color:#e2e8f0; position:relative; }

    /* Sidebar desktop */
    .sidebar {
      width:220px; background:#16213e; padding:24px 16px;
      display:flex; flex-direction:column; gap:4px; flex-shrink:0;
      transition:transform .3s ease;
    }
    .logo { color:#7c5cbf; font-weight:800; font-size:18px; margin-bottom:24px; line-height:1.3; }
    .logo span { color:#a78bfa; font-size:14px; }
    a {
      display:flex; align-items:center; gap:8px; padding:10px 12px;
      border-radius:8px; color:#94a3b8; text-decoration:none;
      font-size:14px; transition:all .2s;
    }
    a:hover, a.active { background:#7c5cbf22; color:#a78bfa; }
    .badge {
      background:#7c5cbf; color:white; font-size:11px;
      padding:1px 7px; border-radius:10px; margin-left:auto;
    }
    .content { flex:1; padding:28px; overflow-y:auto; min-width:0; }

    /* Burger — caché sur desktop */
    .burger {
      display:none; position:fixed; top:14px; left:14px; z-index:200;
      background:#16213e; border:1px solid #2d3748; border-radius:8px;
      padding:8px 10px; cursor:pointer; flex-direction:column; gap:4px;
    }
    .burger span { display:block; width:20px; height:2px; background:#a78bfa; border-radius:2px; }

    /* Overlay */
    .overlay {
      display:none; position:fixed; inset:0; background:#00000066;
      z-index:99;
    }

    /* Mobile */
    @media (max-width: 768px) {
      .burger { display:flex; }
      .sidebar {
        position:fixed; left:0; top:0; bottom:0; z-index:100;
        transform:translateX(-100%); width:240px; padding-top:60px;
        box-shadow:4px 0 20px #00000066;
      }
      .sidebar.open { transform:translateX(0); }
      .overlay { display:block; }
      .content { padding:20px 16px; padding-top:60px; }
    }
  `],
})
export class LayoutComponent {
  navOpen = false;
  newCount = 0;
  constructor(private api: ApiService) {
    setInterval(() => this.loadBadge(), 30000);
    this.loadBadge();
  }
  loadBadge() {
    this.api.getPosts({limit:1}).subscribe(r => this.newCount = r.total > 99 ? 99 : r.total);
  }
}
