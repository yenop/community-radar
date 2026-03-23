import { Component } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ApiService } from "../../core/services/api.service";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
<div class="app">
  <nav class="sidebar">
    <div class="logo">📡 Community<br><span>Radar</span></div>
    <a routerLink="/dashboard" routerLinkActive="active">📊 Dashboard
      <span class="badge" *ngIf="newCount > 0">{{newCount}}</span>
    </a>
    <a routerLink="/criteria" routerLinkActive="active">🎯 Critères</a>
    <a routerLink="/sources" routerLinkActive="active">📡 Sources</a>
    <a routerLink="/stats" routerLinkActive="active">📈 Stats</a>
  </nav>
  <main class="content"><router-outlet/></main>
</div>
  `,
  styles: [`
    .app { display:flex; min-height:100vh; background:#1a1a2e; color:#e2e8f0; }
    .sidebar { width:220px; background:#16213e; padding:24px 16px; display:flex; flex-direction:column; gap:4px; flex-shrink:0; }
    .logo { color:#7c5cbf; font-weight:800; font-size:18px; margin-bottom:24px; line-height:1.3; }
    .logo span { color:#a78bfa; font-size:14px; }
    a { display:flex; align-items:center; gap:8px; padding:10px 12px; border-radius:8px; color:#94a3b8; text-decoration:none; font-size:14px; transition:all .2s; }
    a:hover, a.active { background:#7c5cbf22; color:#a78bfa; }
    .badge { background:#7c5cbf; color:white; font-size:11px; padding:1px 7px; border-radius:10px; margin-left:auto; }
    .content { flex:1; padding:28px; overflow-y:auto; }
  `],
})
export class LayoutComponent {
  newCount = 0;
  constructor(private api: ApiService) {
    setInterval(() => this.loadBadge(), 30000);
    this.loadBadge();
  }
  loadBadge() {
    this.api.getPosts({limit:1}).subscribe(r => this.newCount = r.total > 99 ? 99 : r.total);
  }
}
