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

    const body = {
      areaId: !!data.area ? data.area : null,
      district: data.district,
      startDate: moment(data.range.start).toDate().toISOString(),
      endDate: moment(data.range.end).toDate().toISOString(),
      recyclingTypes: data.recyclingType
    }

    console.log(body)

    return this.http.post(`${environment.apiUrl}/Exports/`,
      body,
      {observe: 'response', responseType: 'blob'}
    )
  }
}
