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
      <div class="stat-label">Notifications</div>
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
    <h3>Détections par jour — 14 derniers jours</h3>
    <div class="chart-wrap">
      <div class="chart">
        <div *ngFor="let d of stats.per_day" class="bar-wrap">
          <div class="bar-count">{{d.count}}</div>
          <div class="bar" [style.height.px]="barHeight(d.count)"></div>
          <div class="bar-label">{{d.day | date:"dd/MM"}}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="test-section">
    <h3>Test notification Telegram</h3>
    <div class="test-row">
      <button (click)="testTelegram()" class="btn-test" [disabled]="testing">
        {{testing ? "Envoi…" : "🔔 Envoyer un test"}}
      </button>
      <span class="test-result" *ngIf="testResult !== null">
        {{testResult ? "✅ Envoyé !" : "❌ Vérifiez TELEGRAM_BOT_TOKEN"}}
      </span>
    </div>
  </div>
</div>
  `,
  styles: [`
    .page { max-width:900px; }
    h1 { font-size:22px; font-weight:700; margin:0 0 20px; }
    h3 { font-size:13px; color:#94a3b8; margin:0 0 14px; text-transform:uppercase; letter-spacing:.5px; }
    .stats-cards {
      display:grid;
      grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));
      gap:10px; margin-bottom:24px;
    }
    .stat-card {
      background:#16213e; border:1px solid #2d3748; border-radius:12px;
      padding:16px; text-align:center;
    }
    .stat-value { font-size:26px; font-weight:800; color:#7c5cbf; margin-bottom:4px; }
    .stat-label { font-size:11px; color:#64748b; line-height:1.3; }
    .chart-section { background:#16213e; border:1px solid #2d3748; border-radius:12px; padding:18px; margin-bottom:20px; }
    .chart-wrap { overflow-x:auto; padding-bottom:4px; }
    .chart { display:flex; gap:6px; align-items:flex-end; min-height:140px; padding-bottom:2px; width:max-content; }
    .bar-wrap { display:flex; flex-direction:column; align-items:center; gap:4px; min-width:38px; }
    .bar { background:#7c5cbf; border-radius:4px 4px 0 0; width:26px; min-height:4px; transition:height .3s; }
    .bar-label { font-size:9px; color:#475569; white-space:nowrap; }
    .bar-count { font-size:10px; color:#7c5cbf; font-weight:700; }
    .test-section { background:#16213e; border:1px solid #2d3748; border-radius:12px; padding:18px; }
    .test-row { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
    .btn-test {
      background:#7c5cbf; color:white; border:none;
      padding:10px 20px; border-radius:8px; cursor:pointer;
      font-weight:600; font-size:14px;
    }
    .btn-test:disabled { opacity:.4; }
    .test-result { font-size:13px; }

    @media (max-width:480px) {
      h1 { font-size:18px; }
      .stats-cards { grid-template-columns:repeat(2, 1fr); }
      .stat-value { font-size:22px; }
      .btn-test { width:100%; text-align:center; }
    }
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
    return max > 0 ? Math.max(4, (count / max) * 110) : 4;
  }
  testTelegram() {
    this.testing = true; this.testResult = null;
    this.api.testNotification().subscribe({
      next: r => { this.testResult = r.ok; this.testing = false; },
      error: () => { this.testResult = false; this.testing = false; }
    });
  }
}
