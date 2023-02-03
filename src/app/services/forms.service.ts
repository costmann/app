import { HttpClient, HttpParams } from '@angular/common/http';

import { ApiResult } from '../models/api-result';
import { IWasteForm } from '../models/interfaces';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private http: HttpClient) { }

  findWasteForms(sortColumn: string, sortOrder: string, filterColumn = '', filterQuery = '', start: Date | null, end: Date | null, pageNumber = 0, pageSize = 10): Observable<ApiResult<IWasteForm>> {

    const startDate = !!start ? (new Date(start)).toISOString() : ''
    const endDate = !!end ? (new Date(end)).toISOString() : startDate

    let params = new HttpParams()
      .set('pageIndex', pageNumber)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder)
      .set('filterColumn', filterColumn)
      .set('filterQuery', filterQuery)
      .set('start', startDate)
      .set('end', endDate)

    return this.http.get<ApiResult<IWasteForm>>(`${environment.apiWIFUrl}/WasteForms`, {
      params,
    })

  }
}
