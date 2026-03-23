import { Routes } from "@angular/router";
export const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "", loadComponent: () => import("./pages/layout/layout.component").then(m => m.LayoutComponent), children: [
    { path: "dashboard", loadComponent: () => import("./pages/dashboard/dashboard.component").then(m => m.DashboardComponent) },
    { path: "criteria", loadComponent: () => import("./pages/criteria/criteria.component").then(m => m.CriteriaComponent) },
    { path: "sources", loadComponent: () => import("./pages/sources/sources.component").then(m => m.SourcesComponent) },
    { path: "stats", loadComponent: () => import("./pages/stats/stats.component").then(m => m.StatsComponent) },
  ]},
];
