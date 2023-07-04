import * as moment from 'moment';

import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { IArea, IRecyclingType } from '../models/interfaces';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportsService {

  constructor(private http: HttpClient) { }

  getAreas(): Observable<IArea[]> {
    return this.http.get<IArea[]>(`${environment.apiUrl}/Exports/Areas`)
  }

  getRecyclingTypes(): Observable<IRecyclingType[]> {
    return this.http.get<IRecyclingType[]>(`${environment.apiUrl}/Exports/RecyclingTypes`)
  }

  getDistricts(queryString: string = ''): Observable<string[]> {

    let params = new HttpParams()
    if (!!queryString) {
      params = params.append('queryString', queryString)
    }

    return this.http.get<string[]>(`${environment.apiUrl}/Exports/Districts`, { params })
  }

  export(data: any): Observable<HttpResponse<Blob>> {


    const start = new Date(data.range.start)
    const end = new Date(data.range.end)

    const body = {
      areaId: !!data.area ? data.area : null,
      district: data.district,
      startDate: new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0)).toISOString().slice(0, 10),
      endDate: new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0)).toISOString().slice(0, 10),
      recyclingTypes: data.recyclingType
    }

    console.log(body)

    return this.http.post(`${environment.apiUrl}/Exports/`,
      body,
      {observe: 'response', responseType: 'blob'}
    )
  }
}
