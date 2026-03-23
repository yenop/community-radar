import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../core/services/api.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="page">
  <div class="page-header">
    <h1>📊 Dashboard</h1>
    <div class="filters">
      <select [(ngModel)]="minScore" (change)="loadPosts()">
        <option value="">Tous les scores</option>
        <option value="0.7">≥ 70%</option>
        <option value="0.8">≥ 80%</option>
        <option value="0.9">≥ 90%</option>
      </select>
    </div>
  </div>
  <div class="posts-grid">
    <div *ngFor="let p of posts" class="post-card">
      <div class="post-header">
        <span class="score" [class.high]="p.score_pertinence>=0.8" [class.medium]="p.score_pertinence>=0.7 && p.score_pertinence<0.8">
          {{(p.score_pertinence*100)|number:"1.0-0"}}%
        </span>
        <span class="date">{{p.detected_at | date:"dd/MM HH:mm"}}</span>
      </div>
      <div class="post-title">{{p.title}}</div>
      <div class="post-content" *ngIf="p.content">{{p.content | slice:0:120}}...</div>
      <div class="post-footer">
        <a [href]="p.url" target="_blank" class="btn-link">🔗 Voir sur Reddit</a>
        <span class="notified" *ngIf="p.notified">✅ Notifié</span>
      </div>
    </div>
    <div *ngIf="posts.length===0" class="empty">Aucun post détecté pour l'instant.<br>Ajoutez des critères et attendez le prochain scan.</div>
  </div>
</div>
  `,
  styles: [`
    .page { max-width:1000px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
    h1 { font-size:24px; font-weight:700; margin:0; }
    select { background:#16213e; border:1px solid #2d3748; color:#e2e8f0; padding:8px 12px; border-radius:8px; }
    .posts-grid { display:flex; flex-direction:column; gap:12px; }
    .post-card { background:#16213e; border:1px solid #2d3748; border-radius:12px; padding:16px; }
    .post-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
    .score { font-weight:700; padding:3px 10px; border-radius:20px; font-size:13px; background:#2d3748; color:#94a3b8; }
    .score.high { background:#4c1d95; color:#c4b5fd; }
    .score.medium { background:#312e81; color:#a5b4fc; }
    .date { font-size:12px; color:#475569; }
    .post-title { font-weight:600; font-size:15px; margin-bottom:6px; color:#f1f5f9; }
    .post-content { font-size:13px; color:#64748b; margin-bottom:10px; }
    .post-footer { display:flex; justify-content:space-between; align-items:center; }
    .btn-link { color:#7c5cbf; text-decoration:none; font-size:13px; }
    .notified { font-size:12px; color:#22c55e; }
    .empty { text-align:center; padding:60px; color:#475569; line-height:2; }
  `]
})
export class DashboardComponent implements OnInit {
  posts: any[] = [];
  minScore = "";
  constructor(private api: ApiService) {}
  ngOnInit() { this.loadPosts(); }
  loadPosts() {
    const params: any = { limit: 50 };
    if (this.minScore) params.min_score = this.minScore;
    this.api.getPosts(params).subscribe(r => this.posts = r.items);
  }
}
