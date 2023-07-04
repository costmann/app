import * as moment from 'moment';

import { HttpClient, HttpParams } from '@angular/common/http';

import { ApiResult } from '../models/api-result';
import { IAnalysesService } from './analyses.datasource';
import { IAnalysisData } from '../models/interfaces';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsolidatedService implements IAnalysesService  {

  constructor(private http: HttpClient) { }

  find(sortColumn: string, sortOrder: string, filterColumn: string = '', filterQuery: string = '', start: Date | null, end: Date | null, pageNumber: number = 0, pageSize: number = 10): Observable<ApiResult<IAnalysisData>> {


    let s = ''
    let e = ''

    if (!!start) {
      const sd = new Date(start)
      s = new Date(Date.UTC(sd.getFullYear(), sd.getMonth(), sd.getDate(), 0, 0, 0)).toISOString().slice(0, 10)
    }

    if (!!end) {
      const ed = new Date(end)
      e = new Date(Date.UTC(ed.getFullYear(), ed.getMonth(), ed.getDate(), 0, 0, 0)).toISOString().slice(0, 10)
    }

    let params = new HttpParams()
      .set('pageIndex', pageNumber)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder)
      .set('filterColumn', filterColumn)
      .set('filterQuery', filterQuery)
      .set('start', s)
      .set('end', e)

    return this.http.get<ApiResult<IAnalysisData>>(`${environment.apiUrl}/Analyses/Consolidated`, {
      params,
    })
  }

}
