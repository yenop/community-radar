import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../core/services/api.service";

@Component({
  selector: "app-criteria",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="page">
  <div class="page-header">
    <h1>🎯 Critères de détection</h1>
  </div>
  <div class="add-form">
    <h3>Nouveau critère</h3>
    <input [(ngModel)]="form.label" placeholder="Nom du critère (ex: Cherche un outil SaaS)" />
    <textarea [(ngModel)]="form.description_naturelle" placeholder="Décrivez en langage naturel ce que vous cherchez...
Ex: Posts de personnes qui cherchent un outil pour gérer leurs finances, cherchent une solution SaaS, demandent des recommandations d'outils..." rows="3"></textarea>
    <button (click)="add()" [disabled]="!form.label || !form.description_naturelle" class="btn-primary">+ Ajouter le critère</button>
  </div>
  <div class="criteria-list">
    <div *ngFor="let c of criteria" class="criteria-card" [class.inactive]="!c.active">
      <div class="criteria-header">
        <span class="label">{{c.label}}</span>
        <div class="actions">
          <button class="btn-toggle" (click)="toggle(c)">{{c.active ? "⏸ Désactiver" : "▶ Activer"}}</button>
          <button class="btn-delete" (click)="delete(c.id)">🗑</button>
        </div>
      </div>
      <div class="description">{{c.description_naturelle}}</div>
      <div class="meta">Créé le {{c.created_at | date:"dd/MM/yyyy"}}</div>
    </div>
    <div *ngIf="criteria.length===0" class="empty">Aucun critère configuré. Ajoutez-en un ci-dessus.</div>
  </div>
</div>
  `,
  styles: [`
    .page { max-width:800px; }
    .page-header { margin-bottom:24px; }
    h1 { font-size:24px; font-weight:700; margin:0; }
    h3 { font-size:14px; color:#94a3b8; margin:0 0 12px; }
    .add-form { background:#16213e; border:1px solid #2d3748; border-radius:12px; padding:20px; margin-bottom:24px; display:flex; flex-direction:column; gap:10px; }
    input, textarea { background:#0f172a; border:1px solid #2d3748; color:#e2e8f0; padding:10px 14px; border-radius:8px; font-size:14px; resize:vertical; font-family:inherit; }
    .btn-primary { background:#7c5cbf; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:600; align-self:flex-start; }
    .btn-primary:disabled { opacity:.4; cursor:not-allowed; }
    .criteria-list { display:flex; flex-direction:column; gap:10px; }
    .criteria-card { background:#16213e; border:1px solid #2d3748; border-radius:12px; padding:16px; }
    .criteria-card.inactive { opacity:.5; }
    .criteria-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
    .label { font-weight:700; color:#f1f5f9; }
    .actions { display:flex; gap:8px; }
    .btn-toggle { background:#1e293b; border:none; color:#94a3b8; padding:5px 12px; border-radius:6px; cursor:pointer; font-size:12px; }
    .btn-delete { background:#450a0a; border:none; color:#fca5a5; padding:5px 10px; border-radius:6px; cursor:pointer; }
    .description { font-size:13px; color:#64748b; margin-bottom:8px; }
    .meta { font-size:11px; color:#334155; }
    .empty { text-align:center; padding:40px; color:#475569; }
  `]
})
export class CriteriaComponent implements OnInit {
  criteria: any[] = [];
  form = { label: "", description_naturelle: "" };
  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getCriteria().subscribe(d => this.criteria = d); }
  add() {
    this.api.createCriteria({...this.form, user_id:1}).subscribe(() => {
      this.form = { label:"", description_naturelle:"" };
      this.load();
    });
  }
  toggle(c: any) { this.api.updateCriteria(c.id, {active: c.active ? 0 : 1}).subscribe(() => this.load()); }
  delete(id: number) { if(confirm("Supprimer ce critère ?")) this.api.deleteCriteria(id).subscribe(() => this.load()); }
}
