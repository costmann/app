import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApiResult } from '../models/api-result';
import { IAnalysesService } from './analyses.datasource';
import { IAnalysisData } from '../models/interfaces';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FindService implements IAnalysesService {

  constructor(private http: HttpClient) { }

  find(sortColumn: string, sortOrder: string, filterColumn: string, filterQuery: string, start: Date | null, end: Date | null, pageNumber: number, pageSize: number): Observable<ApiResult<IAnalysisData>> {

    let params = new HttpParams()
      .set('pageIndex', pageNumber)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder)
      .set('filterQuery', filterQuery)

    return this.http.get<ApiResult<IAnalysisData>>(`${environment.apiUrl}/Analyses/FindAll`, {
      params,
    })

  }

}
