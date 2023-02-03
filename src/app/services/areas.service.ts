import { IAnalysisData, IArea } from '../models/interfaces';
import { Observable, forkJoin, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  constructor(private http: HttpClient) { }

  get(includeDeleted = true): Observable<IArea[]> {
    return this.http.get<IArea[]>(`${environment.apiUrl}/Areas?includeDeleted=${includeDeleted}`)
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Areas/${id}`)
  }

  restore(id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Areas/Restore/${id}`, null)
  }

  add(name: string): Observable<IArea> {
    return this.http.post<IArea>(`${environment.apiUrl}/Areas`, {name: name.toUpperCase()})
  }

  edit(id: number, name: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Areas/${id}`, {name: name.toUpperCase()})
  }

  // setArea(id: number, areaId: number | undefined): Observable<any> {
  //   return this.http.put(`${environment.apiUrl}/Analyses/SetArea/${id}`, {
  //     areaId: areaId
  //   })
  // }

  setArea(ids: number[], areaId: number | null): Observable<any> {
    const arr$: Observable<any>[] = []
    ids.forEach( id => {
      arr$.push(
        this.http.put(`${environment.apiUrl}/Analyses/SetArea/${id}`, { analysisId: id, areaId: areaId })
      )
    })
    return forkJoin(arr$)
  }


}
