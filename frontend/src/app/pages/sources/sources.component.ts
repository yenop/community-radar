import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "../../core/services/api.service";

@Component({
  selector: "app-sources",
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="page">
  <div class="page-header"><h1>📡 Sources surveillées</h1></div>
  <div class="sources-list">
    <div *ngFor="let s of sources" class="source-card" [class.inactive]="!s.active">
      <div class="source-info">
        <span class="type-badge">{{s.type}}</span>
        <span class="name">{{s.name}}</span>
        <a [href]="s.url" target="_blank" class="url">{{s.url}}</a>
      </div>
      <button (click)="toggle(s)" class="btn-toggle" [class.on]="s.active">
        {{s.active ? "✅ Actif" : "⏸ Inactif"}}
      </button>
    </div>
    <div *ngIf="sources.length===0" class="empty">Aucune source configurée.</div>
  </div>
</div>
  `,
  styles: [`
    .page { max-width:800px; }
    h1 { font-size:24px; font-weight:700; margin:0 0 24px; }
    .sources-list { display:flex; flex-direction:column; gap:10px; }
    .source-card { background:#16213e; border:1px solid #2d3748; border-radius:12px; padding:16px; display:flex; justify-content:space-between; align-items:center; gap:12px; }
    .source-card.inactive { opacity:.5; }
    .source-info { display:flex; align-items:center; gap:12px; flex:1; flex-wrap:wrap; }
    .type-badge { background:#312e81; color:#a5b4fc; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700; text-transform:uppercase; }
    .name { font-weight:600; color:#f1f5f9; }
    .url { font-size:12px; color:#475569; text-decoration:none; }
    .btn-toggle { border:none; padding:7px 14px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:600; background:#1e293b; color:#94a3b8; }
    .btn-toggle.on { background:#14532d22; color:#22c55e; border:1px solid #22c55e44; }
    .empty { text-align:center; padding:40px; color:#475569; }
  `]
})
export class SourcesComponent implements OnInit {
  sources: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getSources().subscribe(d => this.sources = d); }
  toggle(s: any) { this.api.toggleSource(s.id, s.active ? 0 : 1).subscribe(() => s.active = !s.active); }
}
