import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILaboratory, IPicture } from '../models/interfaces';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable({
  providedIn: 'root'
})
export class LaboratoriesService {

  constructor(private http: HttpClient) { }

  get(includeDeleted = true): Observable<ILaboratory[]> {
    return this.http.get<ILaboratory[]>(`${environment.apiUrl}/Laboratories?includeDeleted=${includeDeleted}`)
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Laboratories/${id}`)
  }

  add(name: string, file: File | undefined): Observable<ILaboratory> {
    const formData = new FormData()
    formData.append('name', name)
    if (!!file) {
      formData.append('file', file, file.name)
    }
    return this.http.post<ILaboratory>(`${environment.apiUrl}/Laboratories`, formData)
  }

  edit(id: number, name: string): Observable<any> {
    const formData = new FormData()
    formData.append('name', name)
    return this.http.put(`${environment.apiUrl}/Laboratories/${id}`, formData)
  }

  changeLogo(id: number, file: File | undefined): Observable<any> {
    const formData = new FormData()
    if (!!file) {
      formData.append('file', file, file.name)
    }
    return this.http.put(`${environment.apiUrl}/Laboratories/ChangeLogo/${id}`, formData)
  }

  restore(id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Laboratories/Restore/${id}`, null)
  }

  getLogo(id: number): Observable<IPicture> {
    return this.http.get<IPicture>(`${environment.apiUrl}/Laboratories/Logo/${id}`)
  }
}
