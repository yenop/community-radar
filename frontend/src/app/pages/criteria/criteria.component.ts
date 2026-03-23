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
  <div class="page-header"><h1>🎯 Critères de détection</h1></div>
  <div class="add-form">
    <h3>Nouveau critère</h3>
    <input [(ngModel)]="form.label" placeholder="Nom du critère (ex: Cherche un outil SaaS)" />
    <textarea [(ngModel)]="form.description_naturelle" rows="3"
      placeholder="Décrivez ce que vous cherchez en langage naturel…"></textarea>
    <button (click)="add()" [disabled]="!form.label || !form.description_naturelle" class="btn-primary">
      + Ajouter
    </button>
  </div>
  <div class="criteria-list">
    <div *ngFor="let c of criteria" class="criteria-card" [class.inactive]="!c.active">
      <div class="criteria-header">
        <span class="label">{{c.label}}</span>
        <div class="actions">
          <button class="btn-toggle" (click)="toggle(c)">{{c.active ? "⏸" : "▶"}}</button>
          <button class="btn-delete" (click)="delete(c.id)">🗑</button>
        </div>
      </div>
      <div class="description">{{c.description_naturelle}}</div>
      <div class="meta">{{c.created_at | date:"dd/MM/yyyy"}}</div>
    </div>
    <div *ngIf="criteria.length===0" class="empty">Aucun critère. Ajoutez-en un ci-dessus.</div>
  </div>
</div>
  `,
  styles: [`
    .page { max-width:760px; }
    .page-header { margin-bottom:20px; }
    h1 { font-size:22px; font-weight:700; margin:0; }
    h3 { font-size:13px; color:#94a3b8; margin:0 0 10px; text-transform:uppercase; letter-spacing:.5px; }
    .add-form {
      background:#16213e; border:1px solid #2d3748; border-radius:12px;
      padding:18px; margin-bottom:20px; display:flex; flex-direction:column; gap:10px;
    }
    input, textarea {
      background:#0f172a; border:1px solid #2d3748; color:#e2e8f0;
      padding:10px 14px; border-radius:8px; font-size:14px;
      resize:vertical; font-family:inherit; width:100%; box-sizing:border-box;
    }
    .btn-primary {
      background:#7c5cbf; color:white; border:none;
      padding:10px 20px; border-radius:8px; cursor:pointer;
      font-weight:600; font-size:14px; align-self:flex-start;
    }
    .btn-primary:disabled { opacity:.4; cursor:not-allowed; }
    .criteria-list { display:flex; flex-direction:column; gap:10px; }
    .criteria-card { background:#16213e; border:1px solid #2d3748; border-radius:12px; padding:14px 16px; }
    .criteria-card.inactive { opacity:.5; }
    .criteria-header { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:8px; }
    .label { font-weight:700; color:#f1f5f9; font-size:14px; line-height:1.4; }
    .actions { display:flex; gap:6px; flex-shrink:0; }
    .btn-toggle {
      background:#1e293b; border:none; color:#94a3b8;
      padding:5px 10px; border-radius:6px; cursor:pointer; font-size:14px;
    }
    .btn-delete {
      background:#450a0a; border:none; color:#fca5a5;
      padding:5px 9px; border-radius:6px; cursor:pointer; font-size:14px;
    }
    .description { font-size:13px; color:#64748b; margin-bottom:6px; line-height:1.5; }
    .meta { font-size:11px; color:#334155; }
    .empty { text-align:center; padding:40px; color:#475569; }

    @media (max-width:480px) {
      h1 { font-size:18px; }
      .btn-primary { align-self:stretch; text-align:center; }
    }
  `]
})
export class CriteriaComponent implements OnInit {
  criteria: any[] = [];
  form = { label:"", description_naturelle:"" };
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
