import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
const API = "/api";
@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}
  getCriteria(): Observable<any[]> { return this.http.get<any[]>(API+"/criteria"); }
  createCriteria(data: any): Observable<any> { return this.http.post(API+"/criteria", data); }
  updateCriteria(id: number, data: any): Observable<any> { return this.http.patch(API+"/criteria/"+id, data); }
  deleteCriteria(id: number): Observable<any> { return this.http.delete(API+"/criteria/"+id); }
  getSources(): Observable<any[]> { return this.http.get<any[]>(API+"/sources"); }
  toggleSource(id: number, active: number): Observable<any> { return this.http.patch(API+"/sources/"+id, {active}); }
  getPosts(params?: any): Observable<any> {
    let p = new HttpParams();
    if (params?.limit) p = p.set("limit", params.limit);
    if (params?.criteria_id) p = p.set("criteria_id", params.criteria_id);
    if (params?.min_score) p = p.set("min_score", params.min_score);
    return this.http.get<any>(API+"/posts", {params: p});
  }
  getStats(): Observable<any> { return this.http.get<any>(API+"/stats"); }
  testNotification(chat_id?: string): Observable<any> { return this.http.post(API+"/test-notification", {chat_id: chat_id||""}); }
}
