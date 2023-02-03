import { HttpClient } from '@angular/common/http';
import { IAnalysis } from '../models/analysis-interfaces';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  constructor(private http: HttpClient) { }

  // getTemplateSheet(name: string): Observable<IAnalysis> {
  //   return this.http.get(`../assets/${name}.json`).pipe(
  //     map((o) => o as IAnalysis)
  //   )
  // }

  // getTable(name: string): Observable<string[]> {
  //   return this.http.get(`../assets/${name}.json`).pipe(
  //     map((o) => o as string[])
  //   )
  // }

  getTemplateSheet(name: string): Observable<IAnalysis> {
    return this.http.get(`${environment.apiUrl}/Sheets/Template/${name}`).pipe(
      map((s) => s as IAnalysis)
    )
  }

  getTable(name: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/Categories/${name}`)
  }

}
