import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { ILaboratory, IRecyclingType, ISchedule } from '../models/interfaces';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  constructor(private http: HttpClient) { }

  getLaboratories(): Observable<ILaboratory[]> {
    return this.http.get<ILaboratory[]>(`${environment.apiUrl}/Laboratories`)
  }

  getHours(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/Hours`)
  }

  getRecyclingTypes(): Observable<IRecyclingType[]> {
    return this.http.get<IRecyclingType[]>(`${environment.apiUrl}/RecyclingTypes`)
  }

  postSchedule(data: any): Observable<ISchedule> {
    return this.http.post<ISchedule>(`${environment.apiUrl}/Analyses/AddSchedule`, data)
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Analyses/${id}`)
  }

  exportSchedules(data: any): Observable<HttpResponse<Blob>> {
    return this.http.post(`${environment.apiUrl}/Analyses/Export/`,
      data,
      {observe: 'response', responseType: 'blob'}
    )
  }

}
