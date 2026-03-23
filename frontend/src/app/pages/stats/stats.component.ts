import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "../../core/services/api.service";

@Component({
  selector: "app-stats",
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="page">
  <div class="page-header"><h1>📈 Statistiques</h1></div>
  <div class="stats-cards" *ngIf="stats">
    <div class="stat-card">
      <div class="stat-value">{{stats.total_posts}}</div>
      <div class="stat-label">Posts détectés</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{stats.notified_posts}}</div>
      <div class="stat-label">Notifications envoyées</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{(stats.avg_score*100)|number:"1.0-0"}}%</div>
      <div class="stat-label">Score moyen</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{stats.active_criteria}}</div>
      <div class="stat-label">Critères actifs</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{stats.active_sources}}</div>
      <div class="stat-label">Sources actives</div>
    </div>
  </div>
  <div class="chart-section" *ngIf="stats?.per_day?.length">
    <h3>Détections par jour (14 derniers jours)</h3>
    <div class="chart">
      <div *ngFor="let d of stats.per_day" class="bar-wrap">
        <div class="bar" [style.height.px]="barHeight(d.count)" title="{{d.count}} posts"></div>
        <div class="bar-label">{{d.day | date:"dd/MM"}}</div>
        <div class="bar-count">{{d.count}}</div>
      </div>
    </div>
  </div>
  <div class="test-section">
    <h3>Test notification Telegram</h3>
    <button (click)="testTelegram()" class="btn-test" [disabled]="testing">
      {{testing ? "Envoi..." : "🔔 Envoyer un test"}}
    </button>
    <span class="test-result" *ngIf="testResult !== null">
      {{testResult ? "✅ Envoyé !" : "❌ Erreur — vérifiez TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID"}}
    </span>
  </div>
</div>
  `,
  styles: [`
    .page { max-width:900px; }
    h1 { font-size:24px; font-weight:700; margin:0 0 24px; }
    h3 { font-size:14px; color:#94a3b8; margin:0 0 16px; }
    .stats-cards { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:12px; margin-bottom:32px; }
    .stat-card { background:#16213e; border:1px solid #2d3748; border-radius:12px; padding:20px; text-align:center; }
    .stat-value { font-size:28px; font-weight:800; color:#7c5cbf; margin-bottom:4px; }
    .stat-label { font-size:12px; color:#64748b; }
    .chart-section { background:#16213e; border:1px solid #2d3748; border-radius:12px; padding:20px; margin-bottom:24px; }
    .chart { display:flex; gap:8px; align-items:flex-end; height:150px; overflow-x:auto; padding-bottom:4px; }
    .bar-wrap { display:flex; flex-direction:column; align-items:center; gap:4px; min-width:40px; }
    .bar { background:#7c5cbf; border-radius:4px 4px 0 0; width:28px; min-height:4px; transition:height .3s; }
    .bar-label { font-size:10px; color:#475569; }
    .bar-count { font-size:11px; color:#7c5cbf; font-weight:700; }
    .test-section { background:#16213e; border:1px solid #2d3748; border-radius:12px; padding:20px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
    .btn-test { background:#7c5cbf; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:600; }
    .btn-test:disabled { opacity:.4; }
    .test-result { font-size:14px; }
  `]
})
export class StatsComponent implements OnInit {
  stats: any = null;
  testing = false;
  testResult: boolean | null = null;
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getStats().subscribe(d => this.stats = d); }
  barHeight(count: number): number {
    const max = Math.max(...(this.stats?.per_day?.map((d: any) => d.count) || [1]));
    return max > 0 ? Math.max(4, (count / max) * 120) : 4;
  }
  testTelegram() {
    this.testing = true;
    this.testResult = null;
    this.api.testNotification().subscribe({ next: r => { this.testResult = r.ok; this.testing = false; }, error: () => { this.testResult = false; this.testing = false; } });
  }
}
