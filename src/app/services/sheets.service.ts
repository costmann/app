import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { IConfirmationResponse, ISheet } from './../models/interfaces';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable({
  providedIn: 'root'
})
export class SheetsService {

  constructor(private http: HttpClient) { }

  getSheet(id: number, confirmed: boolean): Observable<ISheet> {
    return this.http.get<ISheet>(`${environment.apiUrl}/Sheets/${id}?confirmed=${confirmed}`)
  }

  saveSheet(id: number, json: string): Observable<ISheet> {
    return this.http.post<ISheet>(`${environment.apiUrl}/Sheets`, {id: id, json: json}, httpOptions)
  }

  deleteSheet(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Sheets/${id}`)
  }

  setConfirmation(id: number): Observable<any> {
    return this.http.put<IConfirmationResponse>(`${environment.apiUrl}/Sheets/SetConfirmation/${id}`, {id: id, sendEmail: true}, httpOptions)
  }

  downloadReport(id: number, confirmed: (boolean | null) = null): Observable<HttpResponse<Blob>> {
    return this.http.post(`${environment.apiUrl}/Sheets/Download`, {id: id, confirmed: confirmed}, {
      responseType: 'blob',
      observe: 'response',
    })
  }

}
